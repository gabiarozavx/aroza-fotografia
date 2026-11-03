/* =========================================================
   PÁGINA INICIAL — MARCAÇÃO
   ========================================================= */

if (
    document.querySelector(".hero")
) {

    document.body.classList.add(
        "home"
    );

}


/* =========================================================
   HERO — MOVIMENTO, FADE E CABEÇALHO
   ========================================================= */

const heroInicial = document.querySelector(".hero");
const heroConteudoInicial = document.querySelector(".hero-content");
const cabecalhoInicial = document.querySelector("header");

if (heroInicial && heroConteudoInicial && cabecalhoInicial) {
    let atualizacaoHeroAgendada = false;

    function atualizarHeroNoScroll() {
        atualizacaoHeroAgendada = false;

        const scrollY = window.scrollY;
        const heroHeight = heroInicial.offsetHeight;
        const limiteCabecalho = Math.max(
            heroHeight - cabecalhoInicial.offsetHeight,
            0
        );

        const progress = Math.min(
            scrollY / heroHeight,
            1
        );

        const opacity = Math.max(
            1 - progress * 1.5,
            0
        );

        const textMove = scrollY * -0.25;

        heroConteudoInicial.style.opacity = opacity;
        heroConteudoInicial.style.transform = `translateY(${textMove}px)`;

        cabecalhoInicial.classList.toggle(
            "rolado",
            scrollY >= limiteCabecalho
        );
    }

    function solicitarAtualizacaoHero() {
        if (atualizacaoHeroAgendada) {
            return;
        }

        atualizacaoHeroAgendada = true;
        window.requestAnimationFrame(atualizarHeroNoScroll);
    }

    window.addEventListener(
        "scroll",
        solicitarAtualizacaoHero,
        { passive: true }
    );

    atualizarHeroNoScroll();
}


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


    /* Cabeçalho que contém o menu — recebe uma classe própria
       quando a lista abre, usada no CSS pra tirar o efeito
       "difference" e deixar o texto legível sobre a foto. */

    const cabecalhoDoMenu =
        cabecalhoMenu.closest(
            "header"
        );


    function abrirMenu() {

        cabecalhoMenu.classList.add(
            "aberto"
        );

        cabecalhoDoMenu?.classList.add(
            "menu-aberto"
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

        cabecalhoDoMenu?.classList.remove(
            "menu-aberto"
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


    /* Fecha ao rolar a tela — o cabeçalho volta ao efeito normal.
       Guarda a posição em que o menu foi aberto e só fecha se a
       rolagem for de verdade (alguns pixels), pra não fechar por
       oscilações mínimas, como a barra do navegador no celular. */

    let scrollAoAbrirMenu = 0;

    menuToggle.addEventListener(
        "click",
        () => {

            scrollAoAbrirMenu = window.scrollY;

        }
    );

    window.addEventListener(
        "scroll",
        () => {

            if (
                cabecalhoMenu.classList.contains(
                    "aberto"
                ) &&
                Math.abs(
                    window.scrollY - scrollAoAbrirMenu
                ) > 10
            ) {

                fecharMenu();

            }

        },
        { passive: true }
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


/* =========================================================
   HERO — CARROSSEL DE FOTOGRAFIAS
   ========================================================= */

const heroCarrossel = document.querySelector("[data-hero-carrossel]");

if (heroCarrossel) {
    const slidesHero = heroCarrossel.querySelectorAll(".hero-slide");
    const botaoAnteriorHero = heroCarrossel.querySelector(".hero-anterior");
    const botaoProximoHero = heroCarrossel.querySelector(".hero-proximo");
    const indicadoresHeroContainer = heroCarrossel.querySelector(".hero-indicadores");
    const indicadoresHero = indicadoresHeroContainer
        ? indicadoresHeroContainer.querySelectorAll("button")
        : [];

    let slideHeroAtual = 0;
    let intervaloHero;
    let arrastandoHero = false;

    function mostrarSlideHero(index) {
        slideHeroAtual = (index + slidesHero.length) % slidesHero.length;

        slidesHero.forEach((slide, i) => {
            slide.classList.toggle("ativo", i === slideHeroAtual);
        });

        indicadoresHero.forEach((indicador, i) => {
            const ativo = i === slideHeroAtual;
            indicador.classList.toggle("ativo", ativo);

            if (ativo) {
                indicador.setAttribute("aria-current", "true");
            } else {
                indicador.removeAttribute("aria-current");
            }
        });
    }

    function proximoSlideHero() {
        mostrarSlideHero(slideHeroAtual + 1);
    }

    function iniciarCarrosselHero() {
        clearInterval(intervaloHero);
        intervaloHero = setInterval(proximoSlideHero, 5000);
    }

    botaoAnteriorHero?.addEventListener("click", () => {
        mostrarSlideHero(slideHeroAtual - 1);
        iniciarCarrosselHero();
    });

    botaoProximoHero?.addEventListener("click", () => {
        mostrarSlideHero(slideHeroAtual + 1);
        iniciarCarrosselHero();
    });

    /* Bolinhas — clicáveis e também arrastáveis (scrub) */

    function indiceMaisProximoHero(clientX) {
        let indice = 0;
        let menorDistancia = Infinity;

        indicadoresHero.forEach((indicador, i) => {
            const rect = indicador.getBoundingClientRect();
            const centro = rect.left + rect.width / 2;
            const distancia = Math.abs(clientX - centro);

            if (distancia < menorDistancia) {
                menorDistancia = distancia;
                indice = i;
            }
        });

        return indice;
    }

    if (indicadoresHeroContainer) {

        indicadoresHeroContainer.addEventListener("pointerdown", (event) => {
            arrastandoHero = true;
            indicadoresHeroContainer.classList.add("arrastando");
            indicadoresHeroContainer.setPointerCapture(event.pointerId);

            mostrarSlideHero(indiceMaisProximoHero(event.clientX));
            iniciarCarrosselHero();
        });

        indicadoresHeroContainer.addEventListener("pointermove", (event) => {
            if (!arrastandoHero) {
                return;
            }

            mostrarSlideHero(indiceMaisProximoHero(event.clientX));
        });

        const pararArrasteHero = () => {
            arrastandoHero = false;
            indicadoresHeroContainer.classList.remove("arrastando");
        };

        indicadoresHeroContainer.addEventListener("pointerup", pararArrasteHero);
        indicadoresHeroContainer.addEventListener("pointercancel", pararArrasteHero);
    }

    document.addEventListener("keydown", (event) => {
        if (
            document.activeElement?.matches(
                "input, textarea, select, button, a"
            )
        ) {
            return;
        }

        if (event.key === "ArrowLeft") {
            mostrarSlideHero(slideHeroAtual - 1);
            iniciarCarrosselHero();
        } else if (event.key === "ArrowRight") {
            mostrarSlideHero(slideHeroAtual + 1);
            iniciarCarrosselHero();
        }
    });

    mostrarSlideHero(0);
    iniciarCarrosselHero();
}


/* =========================================================
   HOME — CARROSSEL DE FRASES
   Independente do carrossel de fotografias.
   ========================================================= */

const heroFrase = document.querySelector(".hero-frase");

if (heroFrase) {
    const frasesHero = [
        "Fotografia com foco na essência.",
        "O que permanece depois do instante.",
        "Entre presença, silêncio e movimento.",
        "Fotografar também é escolher o que fica.",
        "Toda imagem guarda alguma coisa."
    ];

    let indiceFraseHero = 0;
    let intervaloFraseHero;
    const movimentoReduzido = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    function trocarFraseHero() {
        heroFrase.classList.add("trocando");

        window.setTimeout(() => {
            indiceFraseHero =
                (indiceFraseHero + 1) % frasesHero.length;

            heroFrase.textContent = frasesHero[indiceFraseHero];
            heroFrase.classList.remove("trocando");
        }, movimentoReduzido ? 0 : 450);
    }

    if (!movimentoReduzido) {
        intervaloFraseHero = window.setInterval(
            trocarFraseHero,
            5000
        );
    }
}


/* =========================================================
   HOME — CARROSSEL DE FOTOGRAFIAS
   ========================================================= */

const carrossel = document.querySelector("[data-carrossel]");

if (carrossel) {
    const slides = carrossel.querySelectorAll(".carrossel-slide");
    const botaoAnteriorCarrossel = carrossel.querySelector(".carrossel-anterior");
    const botaoProximoCarrossel = carrossel.querySelector(".carrossel-proximo");
    const indicadores = carrossel.querySelectorAll(".carrossel-indicadores button");

    let slideAtual = 0;
    let intervaloCarrossel;

    function mostrarSlide(index) {
        slideAtual = (index + slides.length) % slides.length;

        slides.forEach((slide, i) => {
            slide.classList.toggle("ativo", i === slideAtual);
        });

        indicadores.forEach((indicador, i) => {
            const ativo = i === slideAtual;
            indicador.classList.toggle("ativo", ativo);

            if (ativo) {
                indicador.setAttribute("aria-current", "true");
            } else {
                indicador.removeAttribute("aria-current");
            }
        });
    }

    function proximoSlide() {
        mostrarSlide(slideAtual + 1);
    }

    function iniciarCarrossel() {
        clearInterval(intervaloCarrossel);
        intervaloCarrossel = setInterval(proximoSlide, 5000);
    }

    botaoAnteriorCarrossel?.addEventListener("click", () => {
        mostrarSlide(slideAtual - 1);
        iniciarCarrossel();
    });

    botaoProximoCarrossel?.addEventListener("click", () => {
        mostrarSlide(slideAtual + 1);
        iniciarCarrossel();
    });

    indicadores.forEach((indicador, index) => {
        indicador.addEventListener("click", () => {
            mostrarSlide(index);
            iniciarCarrossel();
        });
    });

    mostrarSlide(0);
    iniciarCarrossel();
}


/* =========================================================
   ACERVO — CARROSSEL DE PROJETOS
   Troca automaticamente a cada 7,5s. Com um único projeto
   cadastrado, os indicadores ficam ocultos e a troca nem
   chega a rodar — ao adicionar mais itens em
   .acervo-projetos-trilha, o carrossel passa a girar sozinho.
   ========================================================= */

const carrosselProjetos = document.querySelector("[data-carrossel-projetos]");

if (carrosselProjetos) {
    const trilhaProjetos = carrosselProjetos.querySelector(".acervo-projetos-trilha");
    const itensProjetos = carrosselProjetos.querySelectorAll(".acervo-projeto-item");
    const indicadoresContainerProjetos = carrosselProjetos.querySelector(".acervo-projetos-indicadores");
    const indicadoresProjetos = carrosselProjetos.querySelectorAll(".acervo-projetos-indicadores button");

    let projetoAtual = 0;
    let intervaloProjetos;

    function mostrarProjeto(index) {
        projetoAtual = (index + itensProjetos.length) % itensProjetos.length;

        if (trilhaProjetos) {
            trilhaProjetos.style.transform = `translateX(-${projetoAtual * 100}%)`;
        }

        indicadoresProjetos.forEach((indicador, i) => {
            const ativo = i === projetoAtual;
            indicador.classList.toggle("ativo", ativo);

            if (ativo) {
                indicador.setAttribute("aria-current", "true");
            } else {
                indicador.removeAttribute("aria-current");
            }
        });
    }

    function proximoProjeto() {
        mostrarProjeto(projetoAtual + 1);
    }

    function iniciarCarrosselProjetos() {
        clearInterval(intervaloProjetos);
        intervaloProjetos = setInterval(proximoProjeto, 7500);
    }

    if (itensProjetos.length > 1) {

        indicadoresProjetos.forEach((indicador, index) => {
            indicador.addEventListener("click", () => {
                mostrarProjeto(index);
                iniciarCarrosselProjetos();
            });
        });

        mostrarProjeto(0);
        iniciarCarrosselProjetos();

    } else if (indicadoresContainerProjetos) {

        indicadoresContainerProjetos.style.display = "none";

    }
}


/* =========================================================
   SOBRE — LIGHTBOX DE VISUALIZAÇÃO
   ========================================================= */

const fotosSobre = document.querySelectorAll(".foto-sobre");
const lightboxSobre = document.querySelector("#lightbox-sobre");
const imagemLightboxSobre = lightboxSobre?.querySelector(".lightbox-imagem");
const botaoFecharSobre = lightboxSobre?.querySelector(".lightbox-fechar");

if (fotosSobre.length > 0 && lightboxSobre && imagemLightboxSobre && botaoFecharSobre) {
    function abrirLightboxSobre(foto) {
        const imagem = foto.querySelector("img");
        const origem = foto.getAttribute("href");

        imagemLightboxSobre.src = origem || imagem.src;
        imagemLightboxSobre.alt = imagem.alt;

        lightboxSobre.classList.add("aberto");
        lightboxSobre.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function fecharLightboxSobre() {
        lightboxSobre.classList.remove("aberto");
        lightboxSobre.setAttribute("aria-hidden", "true");
        imagemLightboxSobre.src = "";
        document.body.style.overflow = "";
    }

    fotosSobre.forEach((foto) => {
        foto.addEventListener("click", (event) => {
            event.preventDefault();
            abrirLightboxSobre(foto);
        });
    });

    botaoFecharSobre.addEventListener("click", fecharLightboxSobre);

    lightboxSobre.addEventListener("click", (event) => {
        if (event.target === lightboxSobre) {
            fecharLightboxSobre();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (!lightboxSobre.classList.contains("aberto")) {
            return;
        }

        if (event.key === "Escape") {
            fecharLightboxSobre();
        }
    });
}


/* =========================================================
   TRANSIÇÃO ENTRE PÁGINAS
   Mantém a navegação normal do site e só intercepta links
   internos comuns para permitir o fade para preto.
   ========================================================= */

const movimentoReduzidoPagina = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if (!movimentoReduzidoPagina) {
    window.addEventListener("pageshow", () => {
        document.body.classList.remove("saindo");
    });

    document.addEventListener("click", (event) => {
        const link = event.target.closest("a");

        if (!link) {
            return;
        }

        if (
            event.defaultPrevented ||
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey ||
            link.target === "_blank" ||
            link.hasAttribute("download")
        ) {
            return;
        }

        const destino = new URL(link.href, window.location.href);

        if (
            destino.origin !== window.location.origin ||
            (
                destino.pathname === window.location.pathname &&
                destino.search === window.location.search
            )
        ) {
            return;
        }

        event.preventDefault();
        document.body.classList.add("saindo");

        window.setTimeout(() => {
            window.location.href = destino.href;
        }, 420);
    });
}
