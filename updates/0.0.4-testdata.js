var keystone = require('keystone'),
  async = require('async'),
  User = keystone.list('User');

var admins = [
  {
    name: { first: 'Nicola', last: 'Sutton' },
    email: 'nikkimsutton@gmail.com',
    password: 'password',
    isAdmin: true,
  },
];

function createAdmin(admin, done) {
  var newAdmin = new User.model(admin);
  newAdmin.isAdmin = true;
  newAdmin.save(function(err) {
    if (err) {
      console.error('Error adding admin ' + admin.email + ' to the database:');
      console.error(err);
    } else {
      console.log('Added admin ' + admin.email + ' to the database.');
    }
    done(err);
  });
}

function iteratorFromPrototype(modelName, proto, incrementor) {
  return function(key, done) {
    var Model = keystone.list(modelName);
    var obj = new Model.model(proto);

    function doSave(objt) {
      objt.save(function(err) {
        console.log(modelName);
        done(err);
      });
    }

    if (incrementor) {
      if (typeof incrementor === 'string') {
        incrementSomethin(obj, incrementor, key);
        doSave(obj);
      } else if (typeof incrementor == 'function') {
        var result = incrementor(obj, key);
        if (result && result.then) {
          //ok it's async
          result.then(function(objt) {
            doSave(objt);
          });
        } else {
          doSave(obj);
        }
      }
    } else {
      doSave();
    }
  };
}

function incrementSomethin(obj, somethin, key) {
  obj[somethin] += ' ' + key;
}

function lastNameIncrementor(obj, key) {
  obj.name.last += ' ' + key;
}

var histerIpsum =
  'Ethical pork belly photo booth four loko, distillery aliquip aesthetic exercitation blog typewriter green juice neutra pug banh mi. Pabst fingerstache nesciunt try-hard. Tempor truffaut ugh keffiyeh lumbersexual. Readymade trust fund asymmetrical pour-over. Meggings reprehenderit aute, esse typewriter gastropub food truck in godard blue bottle vice anim. Anim +1 kickstarter, ullamco lo-fi 3 wolf moon banjo bitters.';
var germanIpsum =
  'Ethische Schweinebauch Fotokabine vier loko , Brennerei aliquip ästhetische exercitation Blog Schreibmaschine grünen Saft Neutra Mops Banh mi. Pabst fingerstache nesciunt versuchen hart. Tempor truffaut igitt Keffijeh lumbersexual . Vorgefertigte Trust Fund asymmetrische Übergießverfahren . Meggings reprehenderit aute , Esse Schreibmaschine gastropub Nahrungsmittel-LKW in godard blauen Flasche umge Anim. Anim 1 Kickstarter , ullamco lo-fi 3 Wolfmond Banjo Bitters.';
var stupidKid = {
  public_id: 'qdawavjusopgp0kw0d9v',
  version: 1461999841,
  signature: '78bcd9bc65087da71a16aea532d5fff33ea6e835',
  width: 236,
  height: 320,
  format: 'jpg',
  resource_type: 'image',
  url:
    'http://res.cloudinary.com/our-school-liberia/image/upload/v1461999841/qdawavjusopgp0kw0d9v.jpg',
  secure_url:
    'https://res.cloudinary.com/our-school-liberia/image/upload/v1461999841/qdawavjusopgp0kw0d9v.jpg',
};

var stupidGuy = {
  public_id: 'lnx8d5fn4gtmeuzvoloe',
  version: 1461999996,
  signature: 'b76b2997994fe528537c61ee1b76828378fd5930',
  width: 222,
  height: 320,
  format: 'jpg',
  resource_type: 'image',
  url:
    'http://res.cloudinary.com/our-school-liberia/image/upload/v1461999996/lnx8d5fn4gtmeuzvoloe.jpg',
  secure_url:
    'https://res.cloudinary.com/our-school-liberia/image/upload/v1461999996/lnx8d5fn4gtmeuzvoloe.jpg',
};

var logo = {
  public_id: 'iquksneybiscgdi4lpi1',
  version: 1462000117,
  signature: '3aeef82d13a20cfe37f40eb6a6a33dcd61004cd2',
  width: 170,
  height: 62,
  format: 'png',
  resource_type: 'image',
  url:
    'http://res.cloudinary.com/our-school-liberia/image/upload/v1462000117/iquksneybiscgdi4lpi1.png',
  secure_url:
    'https://res.cloudinary.com/our-school-liberia/image/upload/v1462000117/iquksneybiscgdi4lpi1.png',
};

var demoStudent = {
  name: { first: 'John', last: 'Doe' },
  image: stupidKid,
  bio: histerIpsum,
};

var demoCompany = {
  companyName: 'A Company',
  logo: logo,
  url: 'http://google.com',
};

var demoIndividual = {
  name: { first: 'Supporter', last: 'Individual' },
};

var demoPressRelease = {
  title: 'Press Release',
  source: 'http://google.com',
  dateReleased: '2016-05-01',
};

var demoTeamMember = {
  name: { first: 'Team', last: 'Member' },
  type: 'staff',
  role: 'blah',
  image: stupidGuy,
  bio: histerIpsum,
};

var demoUpdate = {
  title: 'News Update',
  state: 'published',
};

var getLanguages = function(callback) {
  var q = keystone.list('Language').model.find();
  q.exec(function(err, results) {
    callback(results);
  });
};

var languages;

var updateRefs = [];

var linkEnToDe = function(update, index, arr) {
  if ((update.lang = 'en' && index + 1 < arr.length)) {
    var nextUpdate = arr[index + 1];
    console.log(update.id);
    var q = keystone.list('Update').model.findOne({
      id: update.id,
    });
    q.exec(function(err, result) {
      console.log('error', err);
      console.log('result', result);
      // if (!result) {
      // 	return
      // }
      // result.translation = nextUpdate.id;
      // result.save(function() {
      // 	done();
      // });
    });
  }
};

function updateIncrementor(obj, key) {
  return new Promise(function(resolve, reject) {
    //few things to do here
    async.waterfall(
      [
        function(callback) {
          incrementSomethin(obj, 'title', key);

          //alternately assign available languages
          obj.language = languages[key % languages.length];
          obj.content.extended = obj.content.brief =
            obj.language.key === 'en' ? histerIpsum : germanIpsum;
          updateRefs.push({ lang: obj.language, id: obj.id });
          callback(null, obj);
        },
      ],
      function(err, objt) {
        resolve(objt);
      }
    );
  });
}

exports = module.exports = function(done) {
  async.series(
    [
      function(callback) {
        getLanguages(function(langs) {
          languages = langs;
          callback();
        });
      },
      async.times.bind(
        null,
        20,
        iteratorFromPrototype('SupporterCompany', demoCompany, 'companyName')
      ),
      async.times.bind(
        null,
        20,
        iteratorFromPrototype('Student', demoStudent, lastNameIncrementor)
      ),
      async.times.bind(
        null,
        20,
        iteratorFromPrototype('SupporterIndividual', demoIndividual, lastNameIncrementor)
      ),
      async.times.bind(
        null,
        20,
        iteratorFromPrototype('PressRelease', demoPressRelease, function incrementor(obj, key) {
          obj.title += ' ' + key;
          obj.dateReleased.setDate(key + 1 % 30);
        })
      ),
      async.times.bind(
        null,
        10,
        iteratorFromPrototype('TeamMember', demoTeamMember, function incrementor(obj, key) {
          lastNameIncrementor(obj, key);
        })
      ),
      async.times.bind(null, 20, iteratorFromPrototype('Update', demoUpdate, updateIncrementor)),

      // function(done) {
      // 	updateRefs.forEach(linkEnToDe);
      // 	done();
      // }
    ],
    done
  );
};
