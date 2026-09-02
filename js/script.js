/* =========================================================
   HERO — MOVIMENTO E FADE
   ========================================================= */

window.addEventListener("scroll", () => {

    const hero =
        document.querySelector(".hero");

    const heroContent =
        document.querySelector(".hero-content");


    if (!hero || !heroContent) {
        return;
    }


    const scrollY =
        window.scrollY;

    const heroHeight =
        hero.offsetHeight;


    const progress =
        Math.min(
            scrollY / heroHeight,
            1
        );


    /* Fade do texto */

    const opacity =
        Math.max(
            1 - progress * 1.5,
            0
        );


    /* Movimento do texto */

    const textMove =
        scrollY * -0.25;


    heroContent.style.opacity =
        opacity;


    heroContent.style.transform =
        `translateY(${textMove}px)`;


    /* Movimento da fotografia */

    const imageMove =
        scrollY * 0.25;


    hero.style.backgroundPosition =
        `center calc(50% + ${imageMove}px)`;

});


/* =========================================================
   MENU DE TRÊS PONTINHOS
   ========================================================= */

const cabecalhoMenu =
    document.querySelector(
        ".cabecalho-menu"
    );

const menuToggle =
    document.querySelector(
        ".menu-toggle"
    );


if (
    cabecalhoMenu &&
    menuToggle
) {


    function abrirMenu() {

        cabecalhoMenu.classList.add(
            "aberto"
        );


        menuToggle.setAttribute(
            "aria-expanded",
            "true"
        );

    }


    function fecharMenu() {

        cabecalhoMenu.classList.remove(
            "aberto"
        );


        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

    }


    menuToggle.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();


            if (
                cabecalhoMenu.classList.contains(
                    "aberto"
                )
            ) {

                fecharMenu();

            } else {

                abrirMenu();

            }

        }
    );


    /* Fecha ao clicar fora */

    document.addEventListener(
        "click",
        (event) => {

            if (
                !cabecalhoMenu.contains(
                    event.target
                )
            ) {

                fecharMenu();

            }

        }
    );


    /* Fecha com Esc */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key ===
                "Escape"
            ) {

                fecharMenu();

            }

        }
    );

}


/* =========================================================
   FOTOS DO ENSAIO — usadas tanto no fade-in quanto no lightbox
   ========================================================= */

const fotosEnsaio =
    document.querySelectorAll(
        ".foto-ensaio"
    );


/* =========================================================
   FADE-IN DAS FOTOGRAFIAS DOS ENSAIOS
   ========================================================= */

if (
    fotosEnsaio.length > 0
) {

    const observerFotos =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(
                    (entry) => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target
                                .classList
                                .add(
                                    "visivel"
                                );


                            observerFotos
                                .unobserve(
                                    entry.target
                                );

                        }

                    }
                );

            },
            {
                threshold:
                    0.15
            }
        );


    fotosEnsaio.forEach(
        (foto) => {

            observerFotos.observe(
                foto
            );

        }
    );

}


/* =========================================================
   LIGHTBOX
   ========================================================= */

const lightbox =
    document.querySelector(
        "#lightbox"
    );

const imagemLightbox =
    document.querySelector(
        ".lightbox-imagem"
    );

const botaoFechar =
    document.querySelector(
        ".lightbox-fechar"
    );

const botaoAnterior =
    document.querySelector(
        ".lightbox-anterior"
    );

const botaoProxima =
    document.querySelector(
        ".lightbox-proxima"
    );

const contadorLightbox =
    document.querySelector(
        ".lightbox-contador"
    );


let fotoAtual = 0;


/* =========================================================
   LIGHTBOX — VERIFICAÇÃO
   ========================================================= */

if (
    fotosEnsaio.length > 0 &&
    lightbox &&
    imagemLightbox &&
    botaoFechar &&
    botaoAnterior &&
    botaoProxima
) {


    /* =====================================================
       CONTADOR
       ===================================================== */

    function atualizarContador() {

        if (!contadorLightbox) {
            return;
        }


        contadorLightbox.textContent =
            `${String(
                fotoAtual + 1
            ).padStart(
                2,
                "0"
            )} / ${String(
                fotosEnsaio.length
            ).padStart(
                2,
                "0"
            )}`;
    }


    /* =====================================================
       ABRIR
       ===================================================== */

    function abrirLightbox(index) {

        fotoAtual =
            index;


        const imagem =
            fotosEnsaio[
                fotoAtual
            ].querySelector(
                "img"
            );


        imagemLightbox.src =
            imagem.src;


        imagemLightbox.alt =
            imagem.alt;


        atualizarContador();


        lightbox.classList.add(
            "aberto"
        );


        lightbox.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.style.overflow =
            "hidden";
    }


    /* =====================================================
       FECHAR
       ===================================================== */

    function fecharLightbox() {

        lightbox.classList.remove(
            "aberto"
        );


        lightbox.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.style.overflow =
            "";
    }


    /* =====================================================
       ATUALIZAR IMAGEM
       ===================================================== */

    function atualizarLightbox() {

        const imagem =
            fotosEnsaio[
                fotoAtual
            ].querySelector(
                "img"
            );


        imagemLightbox.classList.add(
            "trocando"
        );


        setTimeout(
            () => {

                imagemLightbox.src =
                    imagem.src;


                imagemLightbox.alt =
                    imagem.alt;


                imagemLightbox.classList.remove(
                    "trocando"
                );


                atualizarContador();

            },
            180
        );
    }


    /* =====================================================
       ANTERIOR
       ===================================================== */

    function fotoAnterior() {

        fotoAtual--;


        if (
            fotoAtual < 0
        ) {

            fotoAtual =
                fotosEnsaio.length - 1;
        }


        atualizarLightbox();
    }


    /* =====================================================
       PRÓXIMA
       ===================================================== */

    function fotoProxima() {

        fotoAtual++;


        if (
            fotoAtual >=
            fotosEnsaio.length
        ) {

            fotoAtual = 0;
        }


        atualizarLightbox();
    }


    /* =====================================================
       CLIQUES
       ===================================================== */

    fotosEnsaio.forEach(
        (foto, index) => {

            foto.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();

                    abrirLightbox(
                        index
                    );

                }
            );

        }
    );


    /* =====================================================
       BOTÕES
       ===================================================== */

    botaoFechar.addEventListener(
        "click",
        fecharLightbox
    );


    botaoAnterior.addEventListener(
        "click",
        fotoAnterior
    );


    botaoProxima.addEventListener(
        "click",
        fotoProxima
    );


    /* =====================================================
       FUNDO
       ===================================================== */

    lightbox.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                lightbox
            ) {

                fecharLightbox();

            }

        }
    );


    /* =====================================================
       TECLADO
       ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                !lightbox.classList.contains(
                    "aberto"
                )
            ) {

                return;
            }


            if (
                event.key ===
                "Escape"
            ) {

                fecharLightbox();

            }


            if (
                event.key ===
                "ArrowLeft"
            ) {

                fotoAnterior();

            }


            if (
                event.key ===
                "ArrowRight"
            ) {

                fotoProxima();

            }

        }
    );

}


/* =========================================================
   FORMULÁRIO DE CONTATO — ENVIO VIA EMAILJS
   ========================================================= */

const formularioContato =
    document.querySelector(
        "#formulario-contato"
    );

const statusFormulario =
    document.querySelector(
        "#contato-status"
    );


if (
    formularioContato &&
    statusFormulario
) {

    formularioContato.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            statusFormulario.textContent =
                "Enviando...";


            emailjs.sendForm(
                "service_0zd57le",
                "template_1dwp5mw",
                formularioContato
            )
            .then(
                () => {

                    statusFormulario.textContent =
                        "Mensagem enviada! Retorno em breve.";


                    formularioContato.reset();

                }
            )
            .catch(
                () => {

                    statusFormulario.textContent =
                        "Não foi possível enviar. Tente novamente ou use o e-mail direto.";

                }
            );

        }
    );

}


/* =========================================================
   FILTRO DO ACERVO
   ========================================================= */

const filtros =
    document.querySelectorAll(
        ".filtro"
    );

const acervoItens =
    document.querySelectorAll(
        ".acervo-item"
    );


if (
    filtros.length > 0 &&
    acervoItens.length > 0
) {

    filtros.forEach(
        (filtro) => {

            filtro.addEventListener(
                "click",
                () => {

                    const categoria =
                        filtro.dataset.filtro;


                    /* Atualiza filtro ativo */

                    filtros.forEach(
                        (item) => {

                            item.classList.remove(
                                "ativo"
                            );

                        }
                    );


                    filtro.classList.add(
                        "ativo"
                    );


                    /* Filtra itens */

                    acervoItens.forEach(
                        (item) => {

                            const categoriaItem =
                                item.dataset.categoria;


                            const mostrar =
                                categoria ===
                                    "todos" ||
                                categoria ===
                                    categoriaItem;


                            if (mostrar) {

                                item.classList.remove(
                                    "oculto"
                                );

                            } else {

                                item.classList.add(
                                    "oculto"
                                );

                            }

                        }
                    );

                }
            );

        }
    );

}


/* =========================================================
   HOME — DESTAQUE POR SCROLL NO MOBILE
   ========================================================= */

const cardsHome =
    document.querySelectorAll(
        ".ensaio-card"
    );


if (
    cardsHome.length > 0
) {

    const observerCards =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(
                    (entry) => {

                        if (
                            entry.isIntersecting
                        ) {

                            cardsHome.forEach(
                                (card) => {

                                    card.classList.remove(
                                        "em-destaque"
                                    );

                                }
                            );


                            entry.target.classList.add(
                                "em-destaque"
                            );

                        }

                    }
                );

            },
            {
                root: null,

                /*
                   Cria uma região central
                   da viewport para o destaque.
                */

                rootMargin:
                    "-35% 0px -35% 0px",

                threshold:
                    0.1
            }
        );


    cardsHome.forEach(
        (card) => {

            observerCards.observe(
                card
            );

        }
    );

}
