var LKTutorials = {};

(function (window) {

  var
    _ROOT = '/data/',
    _VERSION = '?v=20160113',

    _lessons = {},
    _units = [],
    _unitsIndex = Object.create(null),
    _curExercise,

    _codeMirror,
    _iframeContainerElt,
    _iframeElt;


  LKTutorials.init = function(lesson, unit, exercise) {
    LKTutorials.loadLessons()
    .then(function() {
      return LKTutorials.loadLesson(lesson);
    })
    .then(function() {
      return LKTutorials.loadExercise(lesson, unit, exercise)
      .catch(function(err) {
        console.log(err);
        if (exercise !== undefined) {
          notify(err, 'warning');
        }
        else {
          document.getElementById('instructions').innerHTML = 'Welcome!';
        }
      });
    });


// console.log(lesson, unit, exercise);

    _iframeContainerElt = document.getElementById('output-container');
    _iframeElt = document.getElementById('output');

    // Enable output zooming with mouse scroll when the user mouse enters the output
    _iframeContainerElt.addEventListener('mouseenter', onMouseenterHandler);

    if (exercise !== undefined) {
      document.title = lesson + ' - ' + unit + ': ' + exercise;
      document.getElementById('title').textContent = exercise;
    }

  };

  LKTutorials.loadLessons = function() {
    return new Promise(function(resolve, reject) {
      httpGetAsync('/lessons.json').then(function(res) {
        _lessons = JSON.parse(res);
        resolve();
      });
    });
  };

  LKTutorials.loadLesson = function(lesson) {
    if (!(lesson !== undefined && isLesson(lesson)))
      return Promise.reject('Unknown lesson');

    return new Promise(function(resolve, reject) {
      httpGetAsync('/lessons/' + lesson + '.json').then(function(res) {
        _units = JSON.parse(res);

        var tocContent = _units.map(function(unit) {
          _unitsIndex[unit.id] = unit;

          // Build HTML nav list
          var name = '<strong>' + unit.title + '</strong>';
          var list = '<ul>' + unit.exercises.map(function(exercise) {
            return [
              '<li><a href="#" onclick="LKTutorials.loadExercise(\'',
              lesson + '\',\'',
              unit.id + '\',\'',
              exercise.id,
              '\');">',
              exercise.title,
              '</a></li>'
            ]
            .join('');
          })
          .join('') + '</ul>';

          return name + list;
        })
        .join('');

        document.getElementById('toc').innerHTML = tocContent;
        resolve();
      });
    });
  };

  LKTutorials.loadExercise = function(lesson, unit, exercise) {
    resetNotifications();
    _iframeContainerElt.style.display = 'none';
    _iframeElt.src = '';

    if (_codeMirror) {
      _codeMirror.setValue('');
      _codeMirror.clearHistory();
    }

    if (!isExercise(lesson, unit, exercise))
      return Promise.reject('Unknown exercise');

    _curExercise = {
      id: exercise,
      title: null,
      path: exercisePath(lesson, unit, exercise),
      defaultCode: null,
      cheatCode: null,
      validationCode: null,
      resultCode: null
    };

    return Promise.join(
      httpGetAsync(exercisePath(lesson, unit, exercise) + 'instructions.html').then(function(res) {
        document.getElementById('instructions').innerHTML = res;
      })
      .catch(function(err) { notify('Instructions ' + err.statusText, 'danger'); }),
      httpGetAsync(exercisePath(lesson, unit, exercise) + 'default-code.js').then(function(res) {
        _curExercise.defaultCode = res;

        _codeMirror = _codeMirror || CodeMirror(document.getElementById('code'), {
          lineNumbers: true,
          mode: 'javascript'
        });
        _codeMirror.setValue(res);

      })
      .catch(function(err) { notify('Default code ' + err.statusText, 'danger'); }),
      httpGetAsync(exercisePath(lesson, unit, exercise) + 'cheat-code.js').then(function(res) {
        _curExercise.cheatCode = res;
      })
      .catch(function(err) { notify('Cheat code ' + err.statusText, 'danger'); }),
      httpGetAsync(exercisePath(lesson, unit, exercise) + 'validation-code.js').then(function(res) {
        _curExercise.validationCode = res;
      })
      .catch(function(err) { notify('Validation code ' + err.statusText, 'danger'); }),
      httpGetAsync(exercisePath(lesson, unit, exercise) + 'result.html').then(function(res) {
        _curExercise.resultCode = res;
      })
      .catch(function(err) { notify('Result code ' + err.statusText, 'danger'); })
    );
  };

  LKTutorials.cheat = function() {
    _codeMirror.setValue(_curExercise.cheatCode);
  };

  LKTutorials.resetScript = function() {
    _codeMirror.setValue(_curExercise.defaultCode);
  };

  LKTutorials.runScript = function() {
    var code = _codeMirror.getValue();

    // TODO validate code

    // sandbox
    _iframeElt.src = fixUrl(_curExercise.path + 'result.html');
    _iframeContainerElt.style.display = '';
    _iframeElt.contentWindow.eval(code);


  };

  /**
     * Parse the query string and returns an object of parameter<>value.
     * @see http://jsperf.com/querystring-with-javascript
     * @param q
     * @returns {{}}
     */
  LKTutorials.getQueryString = function(q) {
    return (function(a) {
      if (a == "") return {};
      var b = {};
      for (var i = 0; i < a.length; ++i) {
        var p = a[i].split('=');
        if (p.length != 2) continue;
        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
      }
      return b;
    })(q.split("&"));
  };


  //**********************
  // Functions to disable page scroll over an iframe
  //**********************

  // Disable scroll zooming and bind back the mouseenter event
  function onMouseleaveHandler(event) {
    _iframeContainerElt.addEventListener('mouseenter', onMouseenterHandler);
    _iframeContainerElt.removeEventListener('mouseleave', onMouseleaveHandler);
    _iframeElt.style.pointerEvents = 'none';
  }

  function onMouseenterHandler(event) {
    // Disable the mouseenter handler until the user leaves the output area
    _iframeContainerElt.removeEventListener('mouseenter', onMouseenterHandler);

    // Enable scrolling zoom
    _iframeElt.style.pointerEvents = 'auto';

    // Handle the mouse leave event
    _iframeContainerElt.addEventListener('mouseleave', onMouseleaveHandler);
  }


  //**********************
  // Utils
  //**********************

  function isLesson(lesson) {
    return lesson !== undefined && lesson in _lessons;
  };

  function isUnit(lesson, unit) {
    return isLesson(lesson) && unit in _unitsIndex;
  };

  function isExercise(lessonId, unitId, exerciseId) {
    if(!isUnit(lessonId, unitId)) return false;

    return _unitsIndex[unitId].exercises.filter(function(e) {
        return e.id === exerciseId;
      }).length != 0;
  };

  function unitPath(lesson, unit) {
    return '/lessons/' + lesson + '/' + unit + '/';
  }

  function exercisePath(lesson, unit, exercise) {
    return unitPath(lesson, unit) + exercise + '/';
  }

  function fixUrl(url) {
    return _ROOT + url + _VERSION;
  }

  function notify(message, type) {
    var notifElt = document.createElement('div');
    notifElt.className = 'alert ' + (type || 'info');
    notifElt.innerHTML = message;
    document.getElementById('alerts').appendChild(notifElt);
  }

  function resetNotifications() {
    document.getElementById('alerts').innerHTML = '';
  }

  // Asynchronous GET
  function httpGetAsync(url) {
    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.onload = function () {
        if (this.status >= 200 && this.status < 300) {
          resolve(xhr.response);
        } else {
          reject({
            status: this.status,
            statusText: xhr.statusText
          });
        }
      };
      xhr.onerror = function () {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      };
      xhr.open("GET", fixUrl(url), true); // true for asynchronous
      xhr.send(null);
    });
  }

})(this);
