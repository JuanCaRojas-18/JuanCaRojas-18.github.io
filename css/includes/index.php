<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Billzen | Facturación Electrónica y Gestión Contable</title>

    <script src="https://kit.fontawesome.com/5cee24cbab.js" crossorigin="anonymous"></script>

    <link rel="stylesheet" href="css/principal.css">
    <link rel="stylesheet" href="css/blog.css">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>

    <header>
        <div class="header-content">
            <div class="logo">
                <h1>Bill<b>zen</b></h1>
            </div>

            <div class="menu" id="show-menu">
                <nav>
                    <ul>
                        <li class="menu-selected"><a href="index.php" class="text-menu-selected"><i class="fas fa-home"></i> Inicio</a></li>
                        <li><a href="#tutoriales"><i class="fa-brands fa-youtube"></i> Tutoriales</a></li>
                        <li><a href="articulos.php"><i class="fas fa-file-alt"></i> Blog</a></li>
                        <li><a href="contactos.php"><i class="fas fa-headset"></i> Contacto</a></li>
                    </ul>
                </nav>
            </div>

            <div id="ctn-icon-search">
                <i class="fa-solid fa-magnifying-glass" id="icon-search"></i>
            </div>
        </div>

        <div id="icon-menu">
            <i class="fa-solid fa-bars"></i>
        </div>
    </header>

    <div id="ctn-bars-search">
        <input type="text" id="inputSearch" placeholder="¿Qué módulo necesitas buscar?">
    </div>
    <ul id="box-search">
        <li><a href="articulos.php"><i class="fa-solid fa-file-invoice"></i>Facturación Electrónica</a></li>
        <li><a href="articulos.php"><i class="fa-solid fa-calculator"></i>Gestión Contable</a></li>
        <li><a href="articulos.php"><i class="fa-solid fa-boxes-stacked"></i>Control de Inventarios</a></li>
    </ul>
    <div id="cover-ctn-search"></div>


    <main class="container-all" id="move-content">
        
        <section class="blog-container-cover">
            <div class="container-info-cover">
                <h1>Billzen</h1>
                <p>Software de Facturación Electrónica DIAN y Gestión Contable para PYMES</p>
                <a href="contactos.php" style="margin-top:20px;"><button style="padding: 15px 40px; cursor:pointer;">Comenzar ahora</button></a>
            </div>
        </section>

        <div class="container-post">
            
            <input type="radio" id="TODOS" name="Categorias" value="TODOS" checked>
            <input type="radio" id="Facturas" name="Categorias" value="Facturas">
            <input type="radio" id="Contabilidad" name="Categorias" value="Contabilidad">
            <input type="radio" id="Funciones" name="Categorias" value="Funciones">

            <div class="container-category">
                <label for="TODOS">Ver Todo</label>
                <label for="Facturas">Facturación</label>
                <label for="Contabilidad">Contabilidad</label>
                <label for="Funciones">Funciones</label>
            </div>

            <div class="posts">

                <article class="post" data-category="Facturas TODOS">
                    <div class="ctn-img"><img src="Img/img.2.2.png" alt="Facturación Billzen"></div>
                    <h2>Cumplimiento Legal DIAN</h2>
                    <span>Sistema actualizado a la normativa 2025/2026.</span>
                    <ul class="ctn-tag">
                        <li>Legal</li>
                    </ul>
                    <a href="articulos.php"><button>Ver detalles</button></a>
                </article>

                <article class="post" data-category="Contabilidad TODOS">
                    <div class="ctn-img"><img src="Img/img.3.3.png" alt="Contabilidad Billzen"></div>
                    <h2>Reportes en Tiempo Real</h2>
                    <span>Entiende la salud de tu negocio al instante con gráficos claros.</span>
                    <ul class="ctn-tag">
                        <li>Control</li>
                    </ul>
                    <a href="articulos.php"><button>Ver detalles</button></a>
                </article>

                <article class="post" data-category="Funciones TODOS">
                    <div class="ctn-img"><img src="Img/img.4.4.png" alt="Soporte Billzen"></div>
                    <h2>Soporte y Capacitación</h2>
                    <span>No solo es software, te enseñamos a manejar tus finanzas.</span>
                    <ul class="ctn-tag">
                        <li>Ayuda</li>
                    </ul>
                    <a href="articulos.php"><button>Ver detalles</button></a>
                </article>

            </div>
        </div>

        <div class="container-footer">
            <footer>
                <div class="logo-footer">
                    <img src="Img/Logo juan Camilo.jpg" alt="Logo Billzen">
                </div>
                <div class="redes-footer">
                    <a href="#"><i class="fa-brands fa-facebook icon-redes-footer"></i></a>
                    <a href="#"><i class="fa-brands fa-instagram icon-redes-footer"></i></a>
                    <a href="#"><i class="fa-brands fa-tiktok icon-redes-footer"></i></a>               
                </div>
                <hr>
                <h4>© <?php echo date("Y"); ?> Billzen - Todos los Derechos Reservados</h4>
            </footer>
        </div>

    </main>

    <script src="js/script.js"></script>
</body>
</html>