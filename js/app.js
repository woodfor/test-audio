//importScripts("./lib/WebAudioRecorder.min.js");
var AudioContext = window.AudioContext || window.webkitAudioContext;
URL = window.URL || window.webkitURL;
var audioContext; //new audio context to help us record
var gumStream;
var input;
var encodingType;
var recorder;
var recIndex = 0;
var encodeAfterRecord = true;
function toogleDownloadLink(e){
  document.getElementById("download").hidden="true";
}
function toggleRecording(e) {
  if (e.classList.contains("recording")) {
    // stop recording
    e.classList.remove("recording");
    stopRecording();
    document.getElementById("status").innerHTML =
      'Recording stoped, please click "downlad" to download ';
    document.getElementById("record").innerHTML = "Record"
  } else {
    startRecording();
    e.classList.add("recording");
    document.getElementById("status").innerHTML = "Recording";
    document.getElementById("record").innerHTML = "Stop record"
    document.getElementById("download").hidden="ture";
  }
}

function startRecording() {
  var constraints = { audio: true, video: false };
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (stream) {
      var encodingTypeSelect = document.getElementById("encodingTypeSelect");
      audioContext = new AudioContext();
      gumStream = stream;
      input = audioContext.createMediaStreamSource(stream);
      encodingType = encodingTypeSelect.options[encodingTypeSelect.selectedIndex].value;
      encodingTypeSelect.disabled = true;
      
      recorder = new WebAudioRecorder(input, {
        workerDir: "js/lib/",
        encoding: encodingType,
        numChannels: 2,
      });
      recorder.onComplete = function (recorder, blob) {
        //__log("Encoding complete");
        createDownloadLink(blob, "myRecording" + ((recIndex<10)?"0":"") + recIndex +  '.' +  recorder.encoding);
        recIndex ++;
        encodingTypeSelect.disabled = false;
      };
      recorder.setOptions({
        timeLimit: 120,
        encodeAfterRecord: encodeAfterRecord,
        ogg: { quality: 0.5 },
        mp3: { bitRate: 160 },
      });
      recorder.startRecording();
    })
    .catch(function (err) {
      alert(err);
    });
}

function stopRecording() {
    //	console.log("stopRecording() called");
	
	//stop microphone access
	gumStream.getAudioTracks()[0].stop();

	//disable the stop button
	//stopButton.disabled = true;
	//recordButton.disabled = false;
	
	//tell the recorder to finish the recording (stop recording + encode the recorded audio)
	recorder.finishRecording();

	//__log('Recording stopped');
}

function createDownloadLink(blob,filename) {
    
    var url = (window.URL || window.webkitURL).createObjectURL(blob);
    var link = document.getElementById("download");
    link.href = url;
    link.download = filename || 'output.wav';
    document.getElementById("download").hidden=false;
	// var url = URL.createObjectURL(blob);
	// var au = document.createElement('audio');
	// var li = document.createElement('li');
	// var link = document.createElement('a');

	// //add controls to the <audio> element
	// au.controls = true;
	// au.src = url;

	// //link the a element to the blob
	// link.href = url;
	// link.download = new Date().toISOString() + '.'+encoding;
	// link.innerHTML = link.download;

	// //add the new audio and a elements to the li element
	// li.appendChild(au);
	// li.appendChild(link);

	// //add the li element to the ordered list
	// recordingsList.appendChild(li);
}
