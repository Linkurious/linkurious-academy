'use strict';

var LKTutorials = {};

(function (window) {

  var
    _ROOT = './data/',
    _VERSION = '?r=' + Date.now(),

    _lessons = {},
    _units = [],
    _unitsIndex = Object.create(null),
    _exercisesIndex = Object.create(null),
    _curExercise,

    _codeMirror,
    _iframeContainerElt,
    _iframeElt;


  LKTutorials.init = function(lessonId, unitId, exerciseId) {
    LKTutorials.loadLessons()
    .then(function() {
      return LKTutorials.loadLesson(lessonId);
    })
    .then(function() {
      return LKTutorials.loadExercise(lessonId, unitId, exerciseId)
      .catch(function(err) {
        if (exerciseId !== undefined) {
          notify(err, 'warning');
        }
        else {
          LKTutorials.loadExercise(lessonId, _units[0].id, _units[0].exercises[0].id);
        }
      });
    })
    .catch(function(err) {
      LKTutorials.loadHome();
    });

    _iframeContainerElt = document.getElementById('output-container');
    _iframeElt = document.getElementById('output');

    if (exerciseId !== undefined) {
      setPageTitle(lessonId, unitId, exerciseId);
    }
  };

  LKTutorials.loadHome = function() {
    document.getElementById('title').textContent = 'Available lessons';
    document.getElementById('instructions').innerHTML = '<ul><li><a href="?lesson=server-api">Server API</a></li></ul>';

    document.getElementById('code').style.display = 'none';
    document.getElementById('run-btn').style.display = 'none';
    document.getElementById('cheat-btn').style.display = 'none';
    document.getElementById('reset-btn').style.display = 'none';
    document.getElementById('next-btn').style.display = 'none';
  };

  LKTutorials.loadLessons = function() {
    return new Promise(function(resolve, reject) {
      httpGetAsync('/lessons.json').then(function(res) {
        _lessons = JSON.parse(res);
        _units = [];
        _unitsIndex = Object.create(null);
        _exercisesIndex = Object.create(null);
        _curExercise = undefined;
        resolve();
      });
    });
  };

  LKTutorials.loadLesson = function(lessonId) {
    if (!(lessonId !== undefined && isLesson(lessonId)))
      return Promise.reject('Unknown lesson');

    document.getElementById('lesson').textContent = _lessons[lessonId].title;

    return new Promise(function(resolve, reject) {
      httpGetAsync('/lessons/' + lessonId + '.json').then(function(res) {
        _units = JSON.parse(res);

        var tocContent = _units.map(function(unit) {
          _unitsIndex[unit.id] = unit;

          // Build HTML nav list
          var name = '<strong>' + unit.title + '</strong>';
          var list = '<ul>' + unit.exercises.map(function(exercise) {
            _exercisesIndex[getUEID(lessonId, unit.id, exercise.id)] = exercise;
            return [
              '<li><a href="#" data-id="',
              lessonId + '/' + unit.id + '/' + exercise.id,
              '" onclick="LKTutorials.loadExercise(\'',
              lessonId + '\',\'',
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

  LKTutorials.loadExercise = function(lessonId, unitId, exerciseId) {
    var ueid = getUEID(lessonId, unitId, exerciseId);

    // Reset UI
    resetNotifications();
    _iframeContainerElt.style.display = 'none';
    document.getElementById('next-btn').style.display = '';
    document.getElementById('next-btn').disabled = 'disabled';
    document.getElementById('validation-output').textContent = '';
    document.getElementById('instructions').innerHTML = '';
    _iframeElt.src = '';

    if (_codeMirror) {
      _codeMirror.setValue('');
      _codeMirror.clearHistory();
    }

    var liList = document.getElementById('toc').getElementsByTagName('li');
    var exerciseSignature = lessonId + '/' + unitId + '/' + exerciseId;
    for (var i=0; i< liList.length; i++) {
      liList[i].className = '';
      if(liList[i].firstChild.dataset.id === exerciseSignature) {
        liList[i].className = 'active';
      }
    }

    if (!isExercise(lessonId, unitId, exerciseId))
      return Promise.reject('Unknown exercise');

    _curExercise = {
      lessonId: lessonId,
      unitId: unitId,
      id: exerciseId,
      ueid: ueid,
      title: _exercisesIndex[ueid].title,
      path: exercisePath(lessonId, unitId, exerciseId),
      language: _exercisesIndex[ueid].language || 'js',
      defaultCode: null,
      cheatCode: null,
      validationCode: null,
      resultCode: null
    };

    setPageTitle(lessonId, unitId, exerciseId);

    document.getElementById('code').style.display = '';
    document.getElementById('run-btn').style.display = '';
    document.getElementById('cheat-btn').style.display = '';
    document.getElementById('reset-btn').style.display = '';

    // Load exercise data in parallel, continue after all data is loaded
    return Promise.join(
      httpGetAsync(exercisePath(lessonId, unitId, exerciseId) + 'instructions.html')
      .then(function(res) {
        document.getElementById('instructions').innerHTML = res;
      })
      .catch(function(err) {
        notify('Instructions ' + err.statusText, 'danger');
      }),

      httpGetAsync(exercisePath(lessonId, unitId, exerciseId) + 'default-code.' + _curExercise.language)
      .then(function(res) {
        _curExercise.defaultCode = res;

        var lang = _curExercise.language;
        if (lang == 'js') lang = 'javascript';

        _codeMirror = _codeMirror || CodeMirror(document.getElementById('code'), {
          lineNumbers: true,
          mode: lang
        });
        _codeMirror.setValue(res);
        _codeMirror.focus();

      })
      .catch(function(err) {
        document.getElementById('code').style.display = 'none';
        document.getElementById('run-btn').style.display = 'none';
        document.getElementById('reset-btn').style.display = 'none';
        document.getElementById('next-btn').disabled = '';
      }),

      httpGetAsync(exercisePath(lessonId, unitId, exerciseId) + 'cheat-code.' + _curExercise.language)
      .then(function(res) {
        _curExercise.cheatCode = res;
      })
      .catch(function(err) {
        document.getElementById('cheat-btn').style.display = 'none';
      }),

      httpGetAsync(exercisePath(_curExercise.lessonId, _curExercise.unitId, _curExercise.id) + 'validation-code.js')
      .then(function(res) {
        _curExercise.validationCode = res;
      })
      .catch(function(err) {
        document.getElementById('run-btn').style.display = 'none';
        document.getElementById('reset-btn').style.display = 'none';
        document.getElementById('next-btn').disabled = '';
      }),

      httpGetAsync(lessonPath(lessonId) + 'result.html').then(function(res) {
        _curExercise.resultCode = res;
      })
      .catch(function(err) {
        notify('Result code ' + err.statusText, 'danger');
      })
    );
  };

  LKTutorials.cheat = function() {
    _codeMirror.setValue(_curExercise.cheatCode);
    this.runScript();
  };

  LKTutorials.resetScript = function() {
    _codeMirror.setValue(_curExercise.defaultCode);
    _iframeContainerElt.style.display = 'none';
    document.getElementById('validation-output').textContent = '';
  };

  LKTutorials.runScript = function() {
    // sandbox
    _iframeElt.src = fixUrl(lessonPath(_curExercise.lessonId) + 'result.html');
    _iframeContainerElt.style.display = '';
  };

  LKTutorials.onResultFrameReady = function() {
    _iframeElt.contentWindow.Promise = Promise;
    _iframeElt.contentWindow.qwest = qwest;
    if (_curExercise.validationCode) {
      _iframeElt.contentWindow.eval(_curExercise.validationCode);
      _iframeElt.contentWindow.run(_codeMirror.getValue());
    }
  };

  LKTutorials.onResultSuccess = function() {
    // The student passed the exercice
    document.getElementById('next-btn').disabled = '';
    document.getElementById('validation-output').textContent = 'SUCCESS';
    document.getElementById('validation-output').style.color = 'green';
  };

  LKTutorials.onResultError = function() {
    // The student failed the exercice
    document.getElementById('next-btn').disabled = 'disabled';
    document.getElementById('validation-output').textContent = 'FAIL';
    document.getElementById('validation-output').style.color = 'red';
  };

  LKTutorials.nextExercice = function() {
    var nextUnitId = _curExercise.unitId;
    var nextExerciseId = _exercisesIndex[_curExercise.ueid].next;

    if (!nextExerciseId) {
      nextUnitId = _unitsIndex[_curExercise.unitId].next;
      if (_unitsIndex[nextUnitId].exercises && _unitsIndex[nextUnitId].exercises.length) {
        nextExerciseId = _unitsIndex[nextUnitId].exercises[0].id;
      }
    }

    if (nextExerciseId) {
      this.loadExercise(_curExercise.lessonId, nextUnitId, nextExerciseId);
    }
    else {
      // No next exercise
      document.getElementById('next-btn').disabled = 'disabled';
      notify('You have completed the last exercise. Congratulations!', 'info');
    }
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
  // Utils
  //**********************

  function setPageTitle(lessonId, unitId, exerciseId) {
    document.title = 'linkurious-academy/' + lessonId + '/' + unitId + '/' + exerciseId;
    if (_curExercise && _curExercise.title) {
      document.getElementById('title').textContent = _curExercise.title;
    }
  }

  function isLesson(lessonId) {
    return lessonId !== undefined && lessonId in _lessons;
  };

  function isUnit(lessonId, unitId) {
    return isLesson(lessonId) && unitId in _unitsIndex;
  };

  function isExercise(lessonId, unitId, exerciseId) {
    if(!isUnit(lessonId, unitId)) return false;

    return _unitsIndex[unitId].exercises.filter(function(e) {
        return e.id === exerciseId;
      }).length != 0;
  };

  function lessonPath(lessonId) {
    return '/lessons/' + lessonId + '/';
  }

  function unitPath(lessonId, unitId) {
    return lessonPath(lessonId) + unitId + '/';
  }

  function exercisePath(lessonId, unitId, exerciseId) {
    return unitPath(lessonId, unitId) + exerciseId + '/';
  }

  function fixUrl(url) {
    return _ROOT + url + _VERSION;
  }

  // Generate Unique Exercise IDentifier
  function getUEID(lessonId, unitId, exerciseId) {
    return [lessonId, unitId, exerciseId].join('/');
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
