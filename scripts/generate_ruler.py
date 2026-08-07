#!/usr/bin/env python3
"""
Generador de regla ArUco para medicion de altura de arboles.
Genera una imagen PNG imprimible en tamano carta (8.5" x 11")
con 3 marcadores ArUco a distancias conocidas.

Marcadores:
- Marker 0: 0cm (base)
- Marker 1: 15cm (centro)
- Marker 2: 30cm (tope)

Uso:
    python scripts/generate_ruler.py
    python scripts/generate_ruler.py --output assets/regla_aruco_30cm.png
"""

import cv2
import numpy as np
import argparse
import os

# Constantes de configuracion
ARUCO_DICT = cv2.aruco.DICT_5X5_50
MARKER_SIZE_PX = 400  # Tamano del marcador en pixels
MARKER_SPACING_CM = 15  # Distancia entre marcadores en cm
MARKER_IDS = [0, 1, 2]  # IDs de los marcadores

# Dimensiones de la hoja carta en pixels (300 DPI)
PAGE_WIDTH_PX = 2550   # 8.5 inches * 300 DPI
PAGE_HEIGHT_PX = 3300  # 11 inches * 300 DPI


def create_aruco_markers():
    """Crea los marcadores ArUco individuales."""
    aruco_dict = cv2.aruco.getPredefinedDictionary(ARUCO_DICT)
    markers = []
    
    for marker_id in MARKER_IDS:
        marker = cv2.aruco.generateImageMarker(aruco_dict, marker_id, MARKER_SIZE_PX)
        # Agregar borde blanco alrededor del marcador
        border = 50
        marker_with_border = np.ones(
            (MARKER_SIZE_PX + 2*border, MARKER_SIZE_PX + 2*border), 
            dtype=np.uint8
        ) * 255
        marker_with_border[border:border+MARKER_SIZE_PX, border:border+MARKER_SIZE_PX] = marker
        markers.append(marker_with_border)
    
    return markers


def create_ruler():
    """Crea la regla completa con marcadores y etiquetas."""
    # Fondo blanco de la hoja (3 canales)
    ruler = np.ones((PAGE_HEIGHT_PX, PAGE_WIDTH_PX, 3), dtype=np.uint8) * 255
    
    # Crear marcadores
    markers = create_aruco_markers()
    marker_total_h = markers[0].shape[0]  # Alto total con borde
    marker_total_w = markers[0].shape[1]  # Ancho total con borde
    
    # Calcular posiciones verticales
    center_x = PAGE_WIDTH_PX // 2
    margin_top = 500
    margin_bottom = 500
    
    # Espacio disponible para los 3 marcadores y espacios entre ellos
    available_height = PAGE_HEIGHT_PX - margin_top - margin_bottom
    spacing_between = (available_height - 3 * marker_total_h) // 2
    
    # Posiciones: centro de cada marcador
    y_positions = []
    current_y = margin_top
    
    # Marker 0 (base - abajo)
    y_positions.append(current_y + marker_total_h)  # Borde inferior del marcador
    current_y += marker_total_h + spacing_between
    
    # Marker 1 (centro)
    y_positions.append(current_y + marker_total_h)
    current_y += marker_total_h + spacing_between
    
    # Marker 2 (tope - arriba)
    y_positions.append(current_y + marker_total_h)
    
    # Dibujar lineas de referencia entre marcadores
    for i in range(len(y_positions) - 1):
        y1 = y_positions[i]
        y2 = y_positions[i + 1]
        # Linea punteada vertical
        for y in range(y1, y2, 20):
            cv2.line(ruler, (center_x, y), (center_x, min(y + 10, y2)), (200, 200, 200), 2)
    
    # Colocar marcadores (de abajo hacia arriba: 0, 15, 30 cm)
    labels = ["0cm (base)", "15cm", "30cm (tope)"]
    
    for marker_idx in range(3):
        marker_id = MARKER_IDS[marker_idx]
        y_bottom = y_positions[marker_idx]
        y_top = y_bottom - marker_total_h
        
        x_start = center_x - marker_total_w // 2
        marker = markers[marker_idx]
        
        # Convertir marcador a 3 canales
        if len(marker.shape) == 2:
            marker_bgr = cv2.cvtColor(marker, cv2.COLOR_GRAY2BGR)
        else:
            marker_bgr = marker
        
        # Colocar marcador en la regla
        ruler[y_top:y_bottom, x_start:x_start+marker_total_w] = marker_bgr
        
        # Agregar etiqueta de distancia a la derecha
        label = labels[marker_idx]
        font = cv2.FONT_HERSHEY_SIMPLEX
        font_scale = 1.8
        thickness = 3
        text_size = cv2.getTextSize(label, font, font_scale, thickness)[0]
        text_x = x_start + marker_total_w + 40
        text_y = y_top + marker_total_h // 2 + text_size[1] // 2
        
        cv2.putText(ruler, label, (text_x, text_y), font, font_scale, (0, 0, 0), thickness)
    
    # Agregar titulo
    title = "ForestData - Regla de Medicion"
    font = cv2.FONT_HERSHEY_SIMPLEX
    text_size = cv2.getTextSize(title, font, 2.5, 5)[0]
    text_x = (PAGE_WIDTH_PX - text_size[0]) // 2
    cv2.putText(ruler, title, (text_x, 250), font, 2.5, (0, 100, 0), 5)
    
    # Agregar instrucciones
    instructions = [
        "Imprimir en tamano CARTA (8.5 x 11 pulgadas)",
        "Escala 1:1 - No escalar al imprimir",
        "Colocar junto al arbol para medicion"
    ]
    y_instruction = PAGE_HEIGHT_PX - 350
    for instruction in instructions:
        text_size = cv2.getTextSize(instruction, font, 1.2, 2)[0]
        text_x = (PAGE_WIDTH_PX - text_size[0]) // 2
        cv2.putText(ruler, instruction, (text_x, y_instruction), font, 1.2, (100, 100, 100), 2)
        y_instruction += 60
    
    return ruler


def main():
    parser = argparse.ArgumentParser(description='Generar regla ArUco para medicion de arboles')
    parser.add_argument('--output', default='assets/regla_aruco_30cm.png', 
                        help='Ruta del archivo de salida')
    args = parser.parse_args()
    
    # Crear directorio si no existe
    os.makedirs(os.path.dirname(args.output), exist_ok=True)
    
    # Generar regla
    ruler = create_ruler()
    
    # Guardar imagen
    cv2.imwrite(args.output, ruler)
    print(f"[OK] Regla generada: {args.output}")
    print(f"   Tamano: {ruler.shape[1]}x{ruler.shape[0]} pixels")
    print(f"   Marcadores: {MARKER_IDS}")
    print(f"   Distancia entre marcadores: {MARKER_SPACING_CM}cm")
    print(f"\nInstrucciones de uso:")
    print(f"   1. Imprimir en tamano CARTA (8.5 x 11 pulgadas)")
    print(f"   2. Configurar escala 1:1 (sin ajustar al tamano)")
    print(f"   3. Cortar por los bordes negros")
    print(f"   4. Colocar junto al arbol para medicion")


if __name__ == "__main__":
    main()
