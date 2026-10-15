document.addEventListener('DOMContentLoaded', function () {
    const slideShow = document.querySelector('.slideShow');
    const slides = document.querySelector('.slides');
    const previousButton = document.querySelector('.portfolio_left');
    const nextButton = document.querySelector('.portfolio_right');
    const filterButtons = document.querySelectorAll('.portfolio_filter button');
    const breadcrumb = document.querySelector('.mainmenu > div');
    const currentPage = document.querySelector('.portfolio-page strong');
    const totalPage = document.querySelector('.portfolio-page em');
    const portfolioPanel = document.querySelector('.portfolio02');
    const infoPanel = document.querySelector('.portfolio01_text');
    const controls = document.querySelector('.portfolio_arrow');
    const tagline = document.querySelector('.portfolio_tagline');

    if (!slideShow || !slides || !previousButton || !nextButton || !infoPanel || !portfolioPanel || !controls) {
        return;
    }

    const projects = [
        {
            id: 'pickgo',
            title: 'PickGo App',
            category: 'web',
            label: 'UI/UX',
            thumbnail: 'images/portfolio/portfolio_pickgo_thumb.png',
            href: './portfolio_pickgo.html'
        },
        {
            id: 'honeybee',
            title: 'HoneyBee Dashboard',
            category: 'web',
            label: 'WEBSITE',
            thumbnail: 'images/portfolio/honeybee_dashboard.png',
            href: 'https://maze-pry-80983983.figma.site/'
        },
        {
            id: 'namanlab',
            title: 'Namanlab',
            category: 'web',
            label: 'WEBSITE',
            thumbnail: 'images/portfolio/namanlab_thumbnail.png',
            href: 'https://namanlab-nu.vercel.app/'
        },
        {
            id: 'disney-plus',
            title: 'Disney+ Website',
            category: 'web',
            label: 'UI/UX',
            thumbnail: 'images/portfolio/disneyplus_thumbnail.png',
            href: './disneyplus.html'
        },
        {
            id: 'easybab-mobile',
            title: 'Easybab Mobile App',
            category: 'web',
            label: 'UI/UX',
            thumbnail: 'images/portfolio/easybab_mobile_thumbnail.png',
            href: './portfolio_mobile.html'
        },
        {
            id: 'event-page',
            title: 'Event Page',
            category: 'web',
            label: 'UI/UX',
            thumbnail: 'images/portfolio/event_page_thumbnail.png',
            href: './portfolio_event.html'
        },
        {
            id: 'save-the-polar-bear',
            title: 'Save the Polar Bear',
            category: 'motion',
            label: 'MOTION',
            thumbnail: 'images/portfolio/polarbear_graphic_thumbnail.png',
            href: './portfolio_graphic_polarbear.html'
        },
        {
            id: 'boda-studio',
            title: 'Boda Studio',
            category: 'web',
            label: 'UI/UX',
            thumbnail: 'images/portfolio/boda_studio_thumbnail.png',
            href: './index.html'
        },
    ];

    const filters = {
        all: function () { return true; },
        web: function (project) { return project.category === 'web'; },
        graphic: function (project) { return project.category === 'graphic'; },
        branding: function (project) { return project.category === 'branding'; },
        motion: function (project) { return project.category === 'motion'; }
    };

    let selectedFilter = 'all';
    let visibleCount = 1;
    let currentPageIndex = 0;
    let filteredProjects = projects.slice();
    let resizeFrame = null;
    let touchStartX = 0;

    function pad(number) {
        return String(number).padStart(2, '0');
    }

    function getVisibleCount() {
        if (window.innerWidth <= 767) {
            return 1;
        }
        if (window.innerWidth <= 1090) {
            return 2;
        }

        const minimumCardWidth = 280;
        const gap = getGap();
        const availableWidth = slideShow.clientWidth;
        return Math.max(1, Math.min(3, Math.floor((availableWidth + gap) / (minimumCardWidth + gap))));
    }

    function getGap() {
        return parseFloat(window.getComputedStyle(slideShow).getPropertyValue('--card-gap')) || 0;
    }

    function getPageCount() {
        return filteredProjects.length ? Math.ceil(filteredProjects.length / visibleCount) : 0;
    }

    function updatePageIndicator() {
        const pageCount = getPageCount();
        currentPage.textContent = pad(pageCount ? currentPageIndex + 1 : 0);
        totalPage.textContent = pad(pageCount);
        previousButton.disabled = pageCount <= 1 || currentPageIndex === 0;
        nextButton.disabled = pageCount <= 1 || currentPageIndex >= pageCount - 1;
        previousButton.setAttribute('aria-disabled', String(previousButton.disabled));
        nextButton.setAttribute('aria-disabled', String(nextButton.disabled));
    }

    function createCard(project) {
        const card = document.createElement('li');
        const link = document.createElement('a');

        card.className = 'project-card';
        card.dataset.projectId = project.id;
        const thumbnailUrl = new URL(project.thumbnail, document.baseURI).href;
        card.style.setProperty('--thumbnail', 'url("' + thumbnailUrl + '")');
        card.style.setProperty('--thumb-category', '"' + project.label + '"');
        card.style.setProperty('--thumb-title', '"' + project.title + '"');

        link.href = project.href;
        if (/^https?:\/\//i.test(project.href)) {
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
        }
        link.setAttribute('aria-label', project.title + ' 열기');
        const thumbnail = document.createElement('img');
        thumbnail.src = thumbnailUrl;
        thumbnail.alt = project.title;
        thumbnail.loading = 'lazy';
        link.appendChild(thumbnail);
        card.appendChild(link);

        return card;
    }

    function renderSlides() {
        slides.replaceChildren();

        if (!filteredProjects.length) {
            const emptyCard = document.createElement('li');
            emptyCard.className = 'portfolio-empty';
            emptyCard.textContent = '준비 중인 작업입니다.';
            slides.appendChild(emptyCard);
            return;
        }

        filteredProjects.forEach(function (project) {
            slides.appendChild(createCard(project));
        });
    }

    function applyPosition(withTransition) {
        const firstCard = slides.querySelector('.project-card');

        if (!firstCard || !filteredProjects.length) {
            slides.style.transform = 'translate3d(0, 0, 0)';
            updatePageIndicator();
            return;
        }

        const gap = getGap();
        const cardWidth = firstCard.getBoundingClientRect().width;
        const offset = currentPageIndex * visibleCount * (cardWidth + gap);

        slides.style.transition = withTransition ? 'transform .45s ease' : 'none';
        slides.style.transform = 'translate3d(' + (-offset) + 'px, 0, 0)';
        updatePageIndicator();
    }

    function updateLayout(withTransition) {
        visibleCount = getVisibleCount();
        slideShow.style.setProperty('--cards-per-view', visibleCount);
        const gap = getGap();
        const cardWidth = (slideShow.clientWidth - (gap * (visibleCount - 1))) / visibleCount;
        slideShow.style.setProperty('--card-width', Math.max(0, cardWidth) + 'px');
        currentPageIndex = Math.min(currentPageIndex, Math.max(0, getPageCount() - 1));
        applyPosition(Boolean(withTransition));
    }

    function updateControlsPlacement() {
        if (window.innerWidth <= 1090) {
            portfolioPanel.insertBefore(controls, tagline || null);
        } else {
            infoPanel.appendChild(controls);
        }
    }

    function selectFilter(button) {
        selectedFilter = button.dataset.filter || 'all';
        filteredProjects = projects.filter(filters[selectedFilter] || filters.all);
        currentPageIndex = 0;

        filterButtons.forEach(function (item) {
            item.classList.toggle('is-active', item === button);
        });

        if (breadcrumb) {
            breadcrumb.textContent = button.dataset.breadcrumb || 'Work';
        }

        renderSlides();
        updateLayout(false);
    }

    function movePage(direction) {
        const pageCount = getPageCount();
        const nextPage = currentPageIndex + direction;

        if (!pageCount || nextPage < 0 || nextPage >= pageCount) {
            return;
        }

        currentPageIndex = nextPage;
        applyPosition(true);
    }

    filterButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            selectFilter(button);
        });
    });

    previousButton.addEventListener('click', function () {
        movePage(-1);
    });

    nextButton.addEventListener('click', function () {
        movePage(1);
    });

    slideShow.addEventListener('touchstart', function (event) {
        touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });

    slideShow.addEventListener('touchend', function (event) {
        const distance = event.changedTouches[0].clientX - touchStartX;

        if (Math.abs(distance) < 40) {
            return;
        }

        movePage(distance < 0 ? 1 : -1);
    }, { passive: true });

    window.addEventListener('resize', function () {
        if (resizeFrame) {
            window.cancelAnimationFrame(resizeFrame);
        }

        resizeFrame = window.requestAnimationFrame(function () {
            updateControlsPlacement();
            updateLayout(false);
        });
    });

    slides.addEventListener('transitionend', function () {
        slides.style.transition = '';
    });

    renderSlides();
    updateControlsPlacement();
    if (breadcrumb) {
        breadcrumb.textContent = 'Work';
    }
    updateLayout(false);
});
