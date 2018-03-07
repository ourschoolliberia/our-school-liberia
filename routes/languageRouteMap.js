var keystone = require('keystone');
var importRoutes = keystone.importer(__dirname);

// Import Route Controllers
var routes = {
  views: importRoutes('./views'),
};

/**
 * Langages can either share a route or specify explicit route paths.
 *
 * The key is the name of the route, not the path. it is used to lookup
 * respective routes for alternate languages.
 *
 * If the controller is set to false, it is assumed to be a static page
 * in this case the template needs to be specified.
 *
 * Templates are either specified as a sharedTemplate (the name of a template view)
 * or as a templatePrefix, which will have -en -de appended on and expect that template
 * view to exist.
 *
 */

module.exports = {
  home: {
    controller: routes.views.index,
    route: '/',
  },
  donate: {
    controller: routes.views.donate,
    method: 'all',
    languages: {
      en: {
        route: '/donate',
      },
      de: {
        route: '/donate',
      },
    },
  },
  about: {
    controller: false,
    templatePrefix: 'about',
    languages: {
      en: {
        route: '/about',
      },
      de: {
        route: '/etwa',
      },
    },
  },

  'about.whatwedo': {
    controller: false,
    templatePrefix: 'about-whatwedo',
    languages: {
      en: {
        route: '/about/what-we-do',
      },
      de: {
        route: '/etwa/was-wir-machen',
      },
    },
  },
  'about.wherewework': {
    controller: false,
    templatePrefix: 'about-wherewework',
    languages: {
      en: {
        route: '/about/where-we-work',
      },
      de: {
        route: '/etwa/wo-wir-arbeiten',
      },
    },
  },

  'about.ourteam': {
    controller: routes.views.teammembers,
    sharedTemplate: 'about-ourteam',
    languages: {
      en: {
        route: '/about/our-team',
      },
      de: {
        route: '/etwa/unser-team',
      },
    },
  },

  'about.ourstudents': {
    controller: routes.views.students,
    languages: {
      en: {
        route: '/about/our-students',
      },
      de: {
        route: '/etwa/unser-studenten',
      },
    },
  },

  'about.supporters': {
    controller: routes.views.supporters,
    languages: {
      en: {
        route: '/about/supporters',
      },
      de: {
        route: '/etwa/unterstutzer',
      },
    },
  },

  // 'about.financials': {
  //   controller: routes.views.annualreports,
  //   languages: {
  //     en: {
  //       route: '/about/jahresberichte',
  //     },
  //     de: {
  //       route: '/etwa/annualreports',
  //     },
  //   },
  // },

  getinvolved: {
    controller: false,
    sharedTemplate: 'get-involved',
    languages: {
      en: {
        route: '/get-involved',
      },
      de: {
        route: '/sich-einlassen',
      },
    },
  },
  'getinvolved.subscribe': {
    method: 'all',
    controller: routes.views.subscribe,
    sharedTemplate: 'get-involved-subscribe',
    languages: {
      en: {
        route: '/get-involved/subscribe',
      },
      de: {
        route: '/sich-einlassen/abonnieren',
      },
    },
  },
  'getinvolved.volunteer': {
    method: 'all',
    controller: routes.views.volunteer,
    languages: {
      en: {
        route: '/get-involved/volunteer',
      },
      de: {
        route: '/sich-einlassen/sich-freiwillig-melden',
      },
    },
  },

  /**
   *  TIP:
   *  see how this one has a controller? if you look at it (routes/views/updates.js)
   *  it does a bit of prep such as load in the updates from the database and make
   *  them available in the 'locals' variable which the template can access.
   *
   *  If you look right at the bottom it will say view.render('updates')
   *  this string is the template it uses. so instead of dynamically configuring the
   *  template name here, it is manually loaded from within the controller.
   */
  'news.updates': {
    controller: routes.views.updates,
    languages: {
      en: {
        route: '/news/updates',
      },
      de: {
        route: '/newsen/updaten',
      },
    },
  },
  'news.updates:post': {
    controller: routes.views.update,
    languages: {
      en: {
        route: '/news/updates/:post',
      },
      de: {
        route: '/newsen/updaten/:post',
      },
    },
  },
  'news.updates.category:category': {
    controller: routes.views.updates,
    languages: {
      en: {
        route: '/news/updates/category/:category',
      },
      de: {
        route: '/newsen/updaten/category/:category',
      },
    },
  },
  'news.videos': {
    controller: routes.views.videos,
    languages: {
      en: {
        route: '/news/videos/',
      },
      de: {
        route: '/newsen/videos/',
      },
    },
  },
  'news.pressreleases': {
    controller: routes.views.pressreleases,
    languages: {
      en: {
        route: '/news/press',
      },
      de: {
        route: '/newsen/pressen',
      },
    },
  },
  'gallery': {
   controller: routes.views.gallery,
   languages: {
       'en': {
           route: '/gallery',
       },
       'de': {
           route: '/fototelier',
       },
   }
  },
  contact: {
    controller: routes.views.contact,
    route: '/contact',
    method: 'all',
  },
};
