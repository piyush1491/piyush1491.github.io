var Questions = [{
    id: 1,
    q: "Tell me something yourself",
    a: "",
    t: 0
},
{
    id: 2,
    q: "How is your job?",
    a: "",
    t: 0
},
{
    id: 3,
    q: "What is your favorite places to visit?",
    a: "",
    t: 0
},
{
    id: 4,
    q: "Your favourite movies",
    a: "",
    t: 0
},
{
    id: 5,
    q: "Your study details",
    a: "",
    t: 0
},
{
    id: 6,
    q: "How was the session?",
    a: "",
    t: 0
}]

//console.log('token in test', window.localStorage.getItem('token'))
// set start
var start = false;

// get quiz panel
var quizPanel = document.getElementById("quiz-panel");
quizPanel.style.display = 'none'

// get into panel
var introPanel = document.getElementById("intro-panel");

// next funxtion
function iterate(id) {

    // get the question
    const question = document.getElementById("question");

    // set the question text
    question.innerText = Questions[id].id + ". " + Questions[id].q;

}

// get action button and attach event handler
var action = document.getElementsByClassName('action-button')[0];
var nametxt = document.getElementsByClassName('name')[0];
var ansText = document.getElementsByClassName('answer-text')[0];

var qIndex = 0;
var quizStatus = ''
var candidateName = ''

// for total time track
var quizStartTime = 0;
var quizEndTime = 0
// each question time track
var qStartTime = 0
var qEndTime = 0

action.addEventListener("click", () => {
    if (nametxt.value && nametxt.value.trim() != '') {
        if (start && (!ansText.value || ansText.value.trim() == '')) {
            alert('Answer should not be blank')
            return;
        }

        if (!start) {
            candidateName = nametxt.value
            introPanel.style.display = 'none';
            quizPanel.style.display = 'block'
            action.innerHTML = 'Next'
            start = true;
            quizStatus = 'InProgress'
            quizStartTime = new Date().getTime();
        }

        //on submit
        if (quizStatus == 'Done') {

            qEndTime = new Date().getTime();
            let qTotalTime = qEndTime - qStartTime
            updateAnswer(qIndex, ansText.value, msToTime(qTotalTime))

            quizEndTime = new Date().getTime();
            var totalTime = quizEndTime - quizStartTime

            // show thanks
            quizPanel.style.display = 'none'
            let actPanel = document.getElementById("action-panel");
            actPanel.style.display = 'none'
            let thankPanel = document.getElementById("thanks");
            thankPanel.style.display = 'block'

            // submit the results
            let totalDuration = msToTime(totalTime)
            generateResult(totalDuration)

        } else if (start && qIndex < 6) {

            iterate(qIndex);

            if (qIndex == 0) {
                qStartTime = new Date().getTime();
            } else {
                qEndTime = new Date().getTime();
                let qTotalTime = qEndTime - qStartTime
                //console.log('total time each q: ' + msToTime(qTotalTime))

                updateAnswer(qIndex - 1, ansText.value, msToTime(qTotalTime))
                //reset
                qStartTime = qEndTime
                ansText.value = ''
            }

            if (qIndex == 5) {
                quizStatus = 'Done'
                action.innerHTML = 'Submit'
            }
            else // set next q index
                qIndex++;
        }
    } else {
        alert('Name should not be empty')
    }
})

function updateAnswer(qId, answer, duration) {
    var qst = Questions[qId]
    qst.a = answer
    qst.t = duration

    console.log('qst array', Questions)
}

function generateResult(totalTime) {
    let q1a = Questions[0].a, q1t = Questions[0].t
    let q2a = Questions[1].a, q2t = Questions[1].t
    let q3a = Questions[2].a, q3t = Questions[2].t
    let q4a = Questions[3].a, q4t = Questions[3].t
    let q5a = Questions[4].a, q5t = Questions[4].t
    let q6a = Questions[5].a, q6t = Questions[5].t

    var resultData = [
        candidateName,
        q1a,
        q1t,
        q2a,
        q2t,
        q3a,
        q3t,
        q4a,
        q4t,
        q5a,
        q5t,
        q6a,
        q6t,
        totalTime
    ];
    console.log('result obj', resultData)
    //generateCSV(resultData)
    uploadCSV(resultData)
}

function msToTime(ms) {
    let sec = (ms / 1000).toFixed(1);
    let min = (ms / (1000 * 60)).toFixed(1);
    let hrs = (ms / (1000 * 60 * 60)).toFixed(1);
    if (sec < 60) return sec + " Sec";
    else if (min < 60) return min + " Min";
    else if (hrs < 24) return hrs + " Hrs";
}


function generateCSV(data) {
    var csv = 'Name, ' +
        'Q1 Answer, Q1 Time Taken,' +
        'Q2 Answer, Q2 Time Taken,' +
        'Q3 Answer, Q3 Time Taken,' +
        'Q4 Answer, Q4 Time Taken,' +
        'Q5 Answer, Q5 Time Taken,' +
        'Q6 Answer, Q6 Time Taken,' +
        'Total Time Taken\n';
    csv += data.join(',');
    csv += "\n";

    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = data[0] + '_result.csv';
    hiddenElement.click();
}

function uploadCSV(data) {

    var csv = 'Name, ' +
        'Q1 Answer, Q1 Time Taken,' +
        'Q2 Answer, Q2 Time Taken,' +
        'Q3 Answer, Q3 Time Taken,' +
        'Q4 Answer, Q4 Time Taken,' +
        'Q5 Answer, Q5 Time Taken,' +
        'Q6 Answer, Q6 Time Taken,' +
        'Total Time Taken\n';
    csv += data.join(',');
    csv += "\n";


    var url = "https://content.dropboxapi.com/2/files/upload";

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    var token = window.localStorage.getItem('token')
    xhr.setRequestHeader("Authorization", "Bearer "+token);
    xhr.setRequestHeader("Dropbox-API-Arg", "{\"autorename\":true,\"mode\":\"add\",\"mute\":false,\"path\":\"/Quiz/quiz.csv\",\"strict_conflict\":false}");
    xhr.setRequestHeader("Content-Type", "application/octet-stream");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            console.log(xhr.responseText);
        }
    };

    xhr.send(csv);
}

