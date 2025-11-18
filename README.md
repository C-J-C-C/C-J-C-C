# Botón de alerta conectado

Este proyecto describe un pequeño botón físico que envía una alerta segura a un backend o a una app móvil cuando se presiona.

## Componentes recomendados
- **Placa con conectividad**: ESP32 con Wi‑Fi/Bluetooth (serie WROOM o C3) para integración con red local o teléfono. Si se busca independencia del teléfono, usar un módulo **LTE‑M/NB‑IoT** (p. ej., SIM7080/SIM7672) con SIM M2M.
- **Alimentación**: batería Li‑ion/LiPo 3.7 V con cargador integrado (TP4056 o circuito similar) y protección. Añade un convertidor DC‑DC de bajo consumo si el módem celular lo requiere.
- **Interfaz de usuario**: un **pulsador** normalmente abierto y un **LED** (o buzzer) para confirmar el envío. Considera un MOSFET o transistor si alimentas un buzzer.
- **Sensor de estado**: interruptor de tapa o termistor opcional para saber si la caja se abre o si la batería se sobrecalienta.

## Consideraciones de seguridad
- **Cifrado en tránsito**:
  - Wi‑Fi/LTE‑M: usa **TLS 1.2+** con validación de certificado del servidor.
  - BLE: usa emparejamiento seguro y una **clave simétrica** para cifrar el payload (p. ej., AES‑GCM). Rota la clave en cada reprovisionamiento.
- **Identidad del dispositivo**: almacena un **ID y clave** únicos en NVS/flash protegida o en un chip seguro (ATECC608A) si se desea mayor resistencia a extracción.
- **Integridad**: firma del firmware (secure boot) y actualizaciones OTA autenticadas.

## Flujo de firmware
1. **Arranque**: inicializa GPIO del botón con interrupción y LED/buzzer. Configura el modo de conectividad elegido.
2. **Conexión**: establece Wi‑Fi/BLE o sesión TLS sobre LTE‑M. Valida el certificado del backend o la clave precompartida.
3. **Evento de botón**: al detectar flanco de presión, debouncing por software/hardware (10–50 ms). Construye un mensaje con `device_id`, `timestamp` y `nonce`.
4. **Envío seguro**: envía el payload cifrado (TLS o AES‑GCM). Espera ACK del backend/app móvil.
5. **Confirmación al usuario**: LED fijo/parpadeo o buzzer corto al recibir ACK; LED/buzzer distinto si falla (timeout/reintento).
6. **Ahorro de energía**: entra en **deep sleep** y despierta por GPIO del botón o temporizador para enviar pings/batería baja.

## Ejemplo mínimo (pseudo‑código ESP-IDF)
```c
void app_main() {
    init_gpio_button_and_led();
    wifi_connect_tls();
    while (true) {
        if (button_pressed()) {
            message_t msg = build_secure_message();
            if (send_tls(&msg)) {
                led_ok();
            } else {
                led_error();
            }
        }
        enter_deep_sleep_until_button();
    }
}
```

## Backend/app móvil
- Endpoint HTTPS para recibir `POST /alert` con JSON cifrado/firmado.
- Guarda eventos con `device_id`, hora y estado de batería, y responde con ACK.
- Implementa rate limiting y registro de auditoría.

## Próximos pasos
- Diseñar PCB o protoboard con el pinout del módulo elegido.
- Implementar OTA segura y monitoreo de batería.
- Probar en campo la cobertura LTE‑M/NB‑IoT o el alcance BLE antes de producción.
