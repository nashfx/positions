exports.port = process.env.APP_PORT || 3002;
exports.env = process.env.ENV || 'dev';
exports.database = 'mongodb://localhost:27017/stats';
exports.appVersion = process.env.APP_VERSION || 1;
exports.apiPath = '/api';
exports.saltRounds = 10;
exports.CONSTANTS = {
    questionsForChallenge: 5,
    practiceSessionLimit: 10,
    timezone: 'America/Santiago',
    points: {
        simple: 100,
        double: 200,
        triple: 300
    },
    challenge: {
        text: {
            finished: {
                tie: 'tie'
            }
        }
    },
    challengeLevel: ['simple', 'double', 'triple'],
    challengeTimesByLevel: {
        simple: 20,
        double: 25,
        triple: 30
    },
    challengeStatus: {
        waiting: 'waiting',
        accepted: 'accepted',
        completed: 'completed'
    },
    sessionStatus: {
        online: 'online',
        offline: 'offline',
        busy: 'busy'
    },
    gameStatus: {
        inProgress: 'inProgress',
        paused: 'paused',
        stopped: 'stopped',
        finished: 'finished'
    },
    xlsxUsersFormat: {
        email: 'Email',
        password: 'Password',
        firstName: 'Nombre',
        lastName: 'Apellido',
        alias: 'Alias',
        teamName: 'Equipo'
    },
    xlsxQuestionsFormat: {
        question: 'Pregunta',
        correctAnswer: 'Respuesta correcta',
        alternativeAnswer1: 'Respuesta alternativa 1',
        alternativeAnswer2: 'Respuesta alternativa 2',
        level: 'Nivel (Simples:1, Dobles: 2, Triples: 3)'
    }
};
