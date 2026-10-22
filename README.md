# Lo de la Popi's — web app de delivery

Web app *mobile first* para tomar pedidos de comida. Sin dependencias ni build: HTML, CSS y JavaScript.

## Flujo
1. **Intro**: se reproduce el video de bienvenida a pantalla completa (con botón "Saltar"). Si el video no está, se muestra el logo sobre fondo negro.
2. **Menú**: categorías deslizables, buscador y botones +/− para armar el pedido.
3. **Pedido**: delivery o retiro, datos del cliente y forma de pago. Al confirmar se abre WhatsApp con el pedido ya escrito, listo para enviar al local.

## Qué tenés que poner
| Archivo | Qué es |
|---|---|
| `assets/intro.mp4` | El video de inicio (ideal: vertical 9:16, MP4 H.264, menos de 5 MB) |
| `assets/logo.jpg` | El logo (ya cargado). Los íconos `icon-*.png` salen de este archivo |
| `config.js` | Nombre, número de WhatsApp, costo de envío, horario, medios de pago y **el menú** |
| `styles.css` (arriba de todo) | Colores de marca (ya tomados del logo: `--brand`, `--accent`, `--red`) |

Para agregar foto a un producto, guardala en `assets/` y agregá `imagen: "assets/archivo.jpg"` al producto en `config.js`.

## Probarlo
```bash
python3 -m http.server 8000
# abrir http://localhost:8000 (en el celu: http://IP-de-tu-compu:8000)
```

## Publicarlo gratis
Sirve cualquier hosting estático: GitHub Pages, Netlify o Vercel (subís la carpeta tal cual).
