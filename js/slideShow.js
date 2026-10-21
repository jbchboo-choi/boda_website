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
    const controls = document.querySelector('.portfolio_arrow');

    if (!slideShow || !slides || !previousButton || !nextButton || !portfolioPanel || !controls) {
        return;
    }

    const projects = [
        {
            id: 'pickgo',
            title: 'PickGo App',
            category: 'web',
            label: 'Web',
            thumbnail: 'images/portfolio/portfolio_pickgo_thumb.png',
            href: './portfolio_pickgo.html'
        },
        {
            id: 'honeybee',
            title: 'HoneyBee Dashboard',
            category: 'web',
            label: 'Web',
            thumbnail: 'images/portfolio/honeybee_dashboard.png',
            href: './portfolio_honeybee.html'
        },
        {
            id: 'namanlab',
            title: 'Namanlab',
            category: 'web',
            label: 'Web',
            thumbnail: 'images/portfolio/namanlab_thumbnail.png',
            href: './portfolio_namanlab.html'
        },
        {
            id: 'disney-plus',
            title: 'Disney+ Website',
            category: 'web',
            label: 'Web',
            thumbnail: 'images/portfolio/disneyplus_thumbnail.png',
            href: './portfolio_disneyplus.html'
        },
        {
            id: 'easybab-mobile',
            title: 'Easybab Mobile App',
            category: 'web',
            label: 'Web',
            thumbnail: 'images/portfolio/easybab_mobile_thumbnail.png',
            href: './portfolio_easybab.html'
        },
        {
            id: 'event-page',
            title: 'Seltos Event Page',
            category: 'web',
            label: 'Web',
            thumbnail: 'images/portfolio/event_page_thumbnail.png',
            href: './portfolio_event.html'
        },
        {
            id: 'save-the-polar-bear',
            title: 'Save the Polar Bear',
            category: 'motion',
            label: 'Motion & 3D',
            thumbnail: 'images/portfolio/polarbear_graphic_thumbnail.png',
            href: './portfolio_graphic_polarbear.html'
        },
        {
            id: 'cimi-drifter',
            title: 'DC Journey',
            category: 'motion',
            label: 'Motion & 3D',
            thumbnail: 'images/portfolio/cimi_drifter_thumbnail.png',
            href: './portfolio_cimi.html'
        },
        {
            id: 'moon320',
            title: 'MOON320 약주·탁주',
            category: 'branding',
            label: 'Branding',
            thumbnail: 'images/portfolio/moon320_thumbnail.jpg',
            href: './portfolio_moon320.html'
        },
        {
            id: 'chae-chungja-noodles',
            title: '채충자 국수',
            category: 'branding',
            label: 'Branding',
            thumbnail: 'images/portfolio/chae_chungja_thumbnail.jpg',
            href: './portfolio_chae_chungja.html'
        },
        {
            id: 'summer-beauty-festa',
            title: '썸머 뷰티 페스타',
            category: 'graphic',
            label: 'Graphic',
            thumbnail: 'images/portfolio/summer_beauty/thumbnail.png',
            href: './portfolio_graphic_summer_beauty.html'
        },
        {
            id: 'troy-autumn-wish-event',
            title: '소원성취 EVENT',
            category: 'graphic',
            label: 'Graphic',
            thumbnail: 'images/portfolio/troy_autumn/thumbnail.png',
            href: './portfolio_graphic_troy_autumn.html'
        },
        {
            id: 'troy-summer',
            title: 'Summer Event Page',
            category: 'graphic',
            label: 'Graphic',
            thumbnail: 'images/portfolio/troy_summer_thumbnail.jpg',
            href: './portfolio_troy_summer.html'
        },
        {
            id: 'secui-graphic',
            title: 'SECUI',
            category: 'graphic',
            label: 'Graphic',
            thumbnail: 'images/portfolio/secui/thumbnail-card.png',
            href: './portfolio_graphic_secui.html'
        },
        {
            id: 'visual-design-award',
            title: 'My Little Escape',
            category: 'graphic',
            label: 'Graphic',
            thumbnail: 'images/portfolio/visual_design_award_thumbnail.png',
            href: './portfolio_graphic_visual.html'
        },
        {
            id: 'social-economy-hanmadang',
            title: '사회적경제 한마당',
            category: 'graphic',
            label: 'Graphic',
            thumbnail: 'images/portfolio/social_economy/thumbnail.jpg',
            href: './portfolio_graphic_social_economy.html'
        },
        {
            id: 'ice-hockey-tournament',
            title: '강원도컵 아이스하키 대회',
            category: 'graphic',
            label: 'Graphic',
            thumbnail: 'images/portfolio/ice_hockey/poster.jpg',
            href: './portfolio_graphic_ice_hockey.html'
        },
        {
            id: 'ssireum-hanmadang',
            title: '씨름 한마당',
            category: 'graphic',
            label: 'Graphic',
            thumbnail: 'images/portfolio/ssireum/poster.png',
            href: './portfolio_graphic_ssireum.html'
        },
        {
            id: 'boda-studio',
            title: 'Boda Studio',
            category: 'web',
            label: 'Web',
            thumbnail: 'images/portfolio/boda_studio_thumbnail.png',
            href: './portfolio_boda.html'
        },
    ];

    const filters = {
        all: function () { return true; },
        web: function (project) { return project.category === 'web' || (project.categories || []).includes('web'); },
        graphic: function (project) { return project.category === 'graphic' || (project.categories || []).includes('graphic'); },
        branding: function (project) { return project.category === 'branding' || (project.categories || []).includes('branding'); },
        motion: function (project) { return project.category === 'motion' || (project.categories || []).includes('motion'); }
    };
    const categoryOrder = { web: 0, graphic: 1, branding: 2, motion: 3 };

    function sortAllProjects(list) {
        return list.slice().sort(function (first, second) {
            return (categoryOrder[first.category] ?? 99) - (categoryOrder[second.category] ?? 99);
        });
    }

    let selectedFilter = 'all';
    let visibleCount = 1;
    let currentPageIndex = 0;
    let filteredProjects = sortAllProjects(projects);
    let resizeFrame = null;
    let touchStartX = 0;

    function pad(number) {
        return String(number).padStart(2, '0');
    }

    function getVisibleCount() {
        if (window.innerWidth <= 767) {
            return 2;
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
        if (project.id === 'secui-graphic') {
            card.classList.add('thumbnail-contain');
        }
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

    function selectFilter(button) {
        selectedFilter = button.dataset.filter || 'all';
        const matchedProjects = projects.filter(filters[selectedFilter] || filters.all);
        filteredProjects = selectedFilter === 'all' ? sortAllProjects(matchedProjects) : matchedProjects;
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
            updateLayout(false);
        });
    });

    slides.addEventListener('transitionend', function () {
        slides.style.transition = '';
    });

    const requestedFilter = new URLSearchParams(window.location.search).get('filter');
    const initialFilterButton = Array.from(filterButtons).find(function (button) {
        return button.dataset.filter === requestedFilter;
    }) || filterButtons[0];

    selectFilter(initialFilterButton);
});
