from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        self.set_font("helvetica", "B", 18)
        self.cell(0, 10, "Reporte de Avances - Proyecto Billzen", ln=True, align="C")
        self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font("helvetica", "I", 8)
        self.cell(0, 10, f"Página {self.page_no()}", align="C")

def generate_pdf():
    pdf = PDF()
    pdf.add_page()
    pdf.set_font("helvetica", size=11)

    sections = [
        ("Contexto del Proyecto", 
         "Billzen es un sistema ERP diseñado para microempresas (Pymes) que centraliza el manejo de Inventario, Contabilidad y Facturación en una sola plataforma. Se caracteriza por ser ultra ligero, funcionar sin conexion y ofrecer una experiencia todo en uno para facilitar el crecimiento de los negocios."),
        
        ("1. Frontend e Interfaz de Usuario",
         "- Landing Page Completa: Diseño moderno con multiples secciones (Caracteristicas, Planes, Testimonios) y enlaces de navegacion fluidos.\n"
         "- Seccion de Descargas: Integramos una seccion especial basada en la interfaz original de la carpeta 'Download_Software', manteniendo la estetica del sistema. Incluye tarjetas de descarga para Windows (.exe) y macOS (.dmg), con logica JS para detectar el sistema operativo del usuario e integrar un simulador de proceso de instalacion interactivo.\n"
         "- Flujo de Autenticacion: Rediseño completo de la pagina de Login, ahora estructurada para solicitar el 'NIT de la empresa' asegurando concordancia con el backend.\n"
         "- Dashboard Central: Eliminacion de autenticaciones en dos pasos innecesarias (Login Empresa -> Login Admin). Se unifico el flujo para que tras iniciar sesion, el usuario sea redirigido inmediatamente al panel interactivo de inventarios y datos.\n"
         "- Session Management: Implementacion de sessionStorage para guardar el token de sesion localmente de forma segura en el navegador."),

        ("2. Integracion con Backend (FastAPI)",
         "- Configuracion de Red: Configuracion exitosa de las peticiones API del frontend para conectarse al servidor corriendo en la IP LAN 172.20.10.8 en el puerto 8000.\n"
         "- Modulos CRUD: Botones de accion en el dashboard (Modificar Precio, Ingresar Stock, Eliminar Producto) conectados con exito a sus respectivos endpoints de la API, identificados con estilos de colores intuitivos.\n"
         "- Pruebas de Comunicacion: Resolucion del problema de '0.0.0.0' / localhost, utilizando la IP interna del equipo Host para que multiples dispositivos conectados a la misma red WiFi/Hotspot puedan visualizar el aplicativo en tiempo real."),

        ("3. Arquitectura y Despliegue",
         "- Redireccionamiento Raiz: Archivo index.html maestro en la raiz del repositorio configurado para redirigir el trafico a /Intranet_Cliente/index.html evitando errores 404.\n"
         "- Sincronizacion GitHub: Control de versiones al dia mediante push a 'main' con el objetivo de testear funcionalidades puramente frontend y mostrar avances al equipo de forma grafica via GitHub Pages (.io).\n"
         "- Resolucion de Mixed Content: Aclaracion arquitectonica de como los navegadores bloquean la comunicacion de un sitio en HTTPS (GitHub Pages) hacia un servidor HTTP local. Se establecio el flujo adecuado para presentaciones basado en Live Server bajo la red LAN hasta que el uso de un tunel HTTPS via Ngrok sea implementado para produccion/acceso externo.")
    ]

    for title, body in sections:
        pdf.set_font("helvetica", "B", 14)
        pdf.cell(0, 10, title, ln=True)
        pdf.set_font("helvetica", size=11)
        pdf.multi_cell(0, 7, body)
        pdf.ln(5)

    pdf.output("Avances_Proyecto_Billzen.pdf")

if __name__ == "__main__":
    generate_pdf()
