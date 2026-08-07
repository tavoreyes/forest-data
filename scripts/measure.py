#!/usr/bin/env python3
"""
Script de medición de altura de árboles usando marcadores ArUco.
Detecta marcadores ArUco en una imagen y calcula la altura
basándose en la distancia conocida entre marcadores.

Uso:
    python scripts/measure.py --image path/to/photo.jpg
    python scripts/measure.py --image path/to/photo.jpg --base-y 500 --tip-y 200
    python scripts/measure.py --image path/to/photo.jpg --interactive
"""

import cv2
import numpy as np
import argparse
import json
import sys
import os

# Configuración de marcadores ArUco
ARUCO_DICT = cv2.aruco.DICT_5X5_50
MARKER_SIZE_CM = 3.7  # Tamaño del marcador en cm (cuadrado negro)
MARKER_SPACING_CM = 15  # Distancia real entre centros de marcadores

# IDs de los marcadores esperados
EXPECTED_MARKERS = {
    0: 0,    # Base (0cm)
    1: 15,   # Centro (15cm)
    2: 30    # Tope (30cm)
}


def detect_markers(image_path):
    """
    Detecta marcadores ArUco en la imagen.
    
    Returns:
        dict: {marker_id: {'center': (x, y), 'corners': array, 'distance_cm': int}}
    """
    # Leer imagen
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"No se pudo leer la imagen: {image_path}")
    
    # Convertir a escala de grises
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Configurar detector ArUco
    aruco_dict = cv2.aruco.getPredefinedDictionary(ARUCO_DICT)
    parameters = cv2.aruco.DetectorParameters()
    detector = cv2.aruco.ArucoDetector(aruco_dict, parameters)
    
    # Detectar marcadores
    corners, ids, rejected = detector.detectMarkers(gray)
    
    detected = {}
    if ids is not None:
        for i, marker_id in enumerate(ids.flatten()):
            if marker_id in EXPECTED_MARKERS:
                # Calcular centro del marcador
                marker_corners = corners[i][0]
                center_x = int(np.mean(marker_corners[:, 0]))
                center_y = int(np.mean(marker_corners[:, 1]))
                
                detected[marker_id] = {
                    'center': (center_x, center_y),
                    'corners': marker_corners.tolist(),
                    'distance_cm': EXPECTED_MARKERS[marker_id]
                }
    
    return detected, img


def calculate_pixels_per_cm(detected_markers):
    """
    Calcula los pixels por cm basándose en marcadores detectados.
    
    Returns:
        float: pixels por cm
        dict: info de calibración
    """
    if len(detected_markers) < 2:
        return None, {'error': 'Se necesitan al menos 2 marcadores para calibrar'}
    
    # Ordenar marcadores por distancia conocida
    sorted_markers = sorted(detected_markers.items(), key=lambda x: x[1]['distance_cm'])
    
    # Calcular distancias entre marcadores consecutivos
    calibrations = []
    for i in range(len(sorted_markers) - 1):
        id1, data1 = sorted_markers[i]
        id2, data2 = sorted_markers[i + 1]
        
        # Distancia en pixels
        dx = data2['center'][0] - data1['center'][0]
        dy = data2['center'][1] - data1['center'][1]
        pixel_distance = np.sqrt(dx**2 + dy**2)
        
        # Distancia real conocida
        real_distance = data2['distance_cm'] - data1['distance_cm']
        
        # Pixels por cm
        px_per_cm = pixel_distance / real_distance
        
        calibrations.append({
            'marker_pair': f"{id1}-{id2}",
            'pixel_distance': float(pixel_distance),
            'real_distance_cm': real_distance,
            'px_per_cm': float(px_per_cm)
        })
    
    # Promediar todas las calibraciones
    avg_px_per_cm = np.mean([c['px_per_cm'] for c in calibrations])
    
    return avg_px_per_cm, {
        'calibrations': calibrations,
        'avg_px_per_cm': float(avg_px_per_cm),
        'num_markers': len(detected_markers)
    }


def measure_height(img, detected_markers, px_per_cm, base_y=None, tip_y=None):
    """
    Mide la altura del árbol basándose en la posición del estudiante.
    
    Args:
        img: Imagen original
        detected_markers: Marcadores detectados
        px_per_cm: Pixels por cm
        base_y: Posición Y de la base del árbol (en pixels)
        tip_y: Posición Y de la punta del árbol (en pixels)
    
    Returns:
        dict: Resultado de la medición
    """
    if base_y is None or tip_y is None:
        return {'error': 'Se requieren base_y y tip_y para la medición'}
    
    # Calcular distancia en pixels
    pixel_height = abs(tip_y - base_y)
    
    # Convertir a centímetros
    height_cm = pixel_height / px_per_cm
    
    # Calcular confianza basada en número de marcadores
    confidence = min(100, len(detected_markers) * 33.3)
    
    return {
        'height_cm': float(height_cm),
        'pixel_height': float(pixel_height),
        'px_per_cm': float(px_per_cm),
        'confidence': float(confidence),
        'base_y': int(base_y),
        'tip_y': int(tip_y),
        'marker_positions': {
            str(k): v['center'] for k, v in detected_markers.items()
        }
    }


def interactive_mode(img, detected_markers, px_per_cm):
    """
    Modo interactivo: el estudiante toca la base y punta del árbol.
    """
    print("\n=== MODO INTERACTIVO ===")
    print("Marcadores detectados:")
    for marker_id, data in sorted(detected_markers.items()):
        print(f"  Marker {marker_id} ({data['distance_cm']}cm): {data['center']}")
    
    print(f"\nCalibración: {px_per_cm:.2f} px/cm")
    
    # Crear ventana para selección
    window_name = "Toca la BASE del arbol (tecla libra para cancelar)"
    cv2.namedWindow(window_name, cv2.WINDOW_NORMAL)
    cv2.resizeWindow(window_name, 800, 600)
    
    points = []
    
    def mouse_callback(event, x, y, flags, param):
        if event == cv2.EVENT_LBUTTONDOWN:
            points.append(('base', x, y))
            cv2.circle(img, (x, y), 10, (0, 255, 0), -1)
            cv2.imshow(window_name, img)
    
    cv2.setMouseCallback(window_name, mouse_callback)
    cv2.imshow(window_name, img)
    
    print("\nHaz clic en la BASE del árbol...")
    while len(points) < 1:
        if cv2.waitKey(1) & 0xFF == 27:  # ESC para cancelar
            cv2.destroyAllWindows()
            return {'error': 'Cancelado por el usuario'}
    
    # Ahora seleccionar la punta
    window_name2 = "Toca la PUNTA del arbol (tecla libra para cancelar)"
    cv2.namedWindow(window_name2, cv2.WINDOW_NORMAL)
    cv2.resizeWindow(window_name2, 800, 600)
    
    def mouse_callback2(event, x, y, flags, param):
        if event == cv2.EVENT_LBUTTONDOWN:
            points.append(('tip', x, y))
            cv2.circle(img, (x, y), 10, (0, 0, 255), -1)
            cv2.imshow(window_name2, img)
    
    cv2.setMouseCallback(window_name2, mouse_callback2)
    cv2.imshow(window_name2, img)
    
    print("Haz clic en la PUNTA del árbol...")
    while len(points) < 2:
        if cv2.waitKey(1) & 0xFF == 27:  # ESC para cancelar
            cv2.destroyAllWindows()
            return {'error': 'Cancelado por el usuario'}
    
    cv2.destroyAllWindows()
    
    # Extraer coordenadas
    base_y = points[0][2]
    tip_y = points[1][2]
    
    return measure_height(img, detected_markers, px_per_cm, base_y, tip_y)


def main():
    parser = argparse.ArgumentParser(description='Medición de altura con ArUco')
    parser.add_argument('--image', required=True, help='Ruta de la imagen')
    parser.add_argument('--base-y', type=int, help='Posición Y de la base (pixels)')
    parser.add_argument('--tip-y', type=int, help='Posición Y de la punta (pixels)')
    parser.add_argument('--interactive', action='store_true', help='Modo interactivo')
    parser.add_argument('--output-json', action='store_true', help='Salida en formato JSON')
    args = parser.parse_args()
    
    try:
        # Detectar marcadores
        detected, img = detect_markers(args.image)
        
        if len(detected) < 2:
            result = {
                'error': f'Se detectaron {len(detected)} marcadores. Se necesitan al menos 2.',
                'detected_markers': list(detected.keys()),
                'expected_markers': list(EXPECTED_MARKERS.keys())
            }
            if args.output_json:
                print(json.dumps(result, indent=2))
            else:
                print(f"Error: {result['error']}")
                print(f"Marcadores detectados: {result['detected_markers']}")
            sys.exit(1)
        
        # Calibrar
        px_per_cm, cal_info = calculate_pixels_per_cm(detected)
        
        if px_per_cm is None:
            result = {'error': 'No se pudo calibrar', 'details': cal_info}
            if args.output_json:
                print(json.dumps(result, indent=2))
            else:
                print(f"Error de calibración: {cal_info['error']}")
            sys.exit(1)
        
        # Medir
        if args.interactive:
            result = interactive_mode(img, detected, px_per_cm)
        elif args.base_y is not None and args.tip_y is not None:
            result = measure_height(img, detected, px_per_cm, args.base_y, args.tip_y)
        else:
            result = {
                'error': 'Se requiere --interactive o --base-y y --tip-y',
                'calibration': cal_info,
                'detected_markers': {str(k): v['center'] for k, v in detected.items()}
            }
        
        # Salida
        if args.output_json:
            print(json.dumps(result, indent=2))
        else:
            if 'error' not in result:
                print(f"\n=== RESULTADO DE MEDICION ===")
                print(f"Altura: {result['height_cm']:.1f} cm ({result['height_cm']/100:.2f} m)")
                print(f"Confianza: {result['confidence']:.0f}%")
                print(f"Calibración: {result['px_per_cm']:.2f} px/cm")
            else:
                print(f"\nError: {result['error']}")
        
        sys.exit(0)
        
    except Exception as e:
        result = {'error': str(e)}
        if args.output_json:
            print(json.dumps(result, indent=2))
        else:
            print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
