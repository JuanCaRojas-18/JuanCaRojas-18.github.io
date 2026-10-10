from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        self.set_font("helvetica", "B", 18)
        self.cell(0, 10, "Evolucion de la Landing Page - Billzen", ln=True, align="C")
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
        ("Contexto Inicial de la Landing Page", 
         "Originalmente, el proyecto contaba con una Landing Page ubicada en la ruta interna 'Intranet_Cliente/index.html'. Esta pagina tenia un diseño limpio y moderno con modo claro, presentando las caracteristicas principales del ERP, los modulos, y los planes de precios. Sin embargo, carecia de un punto de acceso principal en la raiz del proyecto y no ofrecia una opcion para que los usuarios descargaran la aplicacion de escritorio."),
        
        ("Fase 1: Implementacion de Descargas Interactivas y Enrutamiento",
         "- Creacion del Index Raiz: Se detecto que los botones de 'Volver al Inicio' en paginas como el login o los articulos arrojaban un error 404. Para solucionarlo, se creo un archivo 'index.html' en la raiz del proyecto que redirige automaticamente al usuario hacia la Landing Page correcta.\n"
         "- Nueva Seccion de Descargas: Se agrego por primera vez una seccion dedicada a la descarga del software entre 'Planes' y 'Testimonios'.\n"
         "- Diseño Complejo Inicial: Esta primera version incluia mini-vistas (previews) muy animadas de la aplicacion simulando la interfaz de Windows (con graficas) y macOS (con un Dock interactivo). Tambien se añadieron botones en el menu superior y en el pie de pagina para facilitar el acceso."),

        ("Fase 2: Adaptacion y Evolucion del Diseño (Version Final)",
         "- Requerimiento del Cliente: Se solicito alinear la seccion de descargas con un prototipo visual especifico almacenado en la carpeta 'Download_Software', buscando un enfoque mas directo y menos recargado.\n"
         "- Simplificacion del Diseño: Se reemplazo la seccion altamente animada por una estructura mas limpia de tarjetas (Cards). Ahora se muestran dos bloques bien definidos: uno para Windows (.exe) y otro para macOS (.dmg).\n"
         "- Mantenimiento de la Estetica 'Billzen': Aunque se tomo la estructura del prototipo proporcionado, se aplicaron las variables CSS globales del proyecto (colores oscuros de fondo y acentos verdes) para que la seccion se sintiera como una continuacion natural de la Landing Page principal y no como un parche ajeno.\n"
         "- JS Simplificado: El script de deteccion y animacion se simplifico para enfocarse unicamente en apuntar las descargas hacia la ruta de 'GitHub Releases', dejando el flujo listo para publicacion."),

        ("Estado Actual (Publicado en .io)",
         "La Landing Page final es el punto de entrada oficial del sitio. Combina informacion comercial del producto con un canal de distribucion directo para el software de escritorio, funcionando perfectamente en GitHub Pages al ser contenido estatico.")
    ]

    for title, body in sections:
        pdf.set_font("helvetica", "B", 14)
        pdf.cell(0, 10, title, ln=True)
        pdf.set_font("helvetica", size=11)
        pdf.multi_cell(0, 7, body)
        pdf.ln(5)

    pdf.output("Evolucion_Landing_Page.pdf")

if __name__ == "__main__":
    generate_pdf()
