const textarea = document.querySelector("textarea"),
  voiceList = document.querySelector("select"),
  speechBtn = document.querySelector("button");

let synth = window.speechSynthesis,
  isSpeaking = false;

textarea.value = `Silent night, holy night,
All is calm, all is bright.
Round yon Virgin, Mother and Child,
Holy infant so tender and mild.`;

voices();

function voices() {
  for (let voice of synth.getVoices()) {
    let selected = voice.name === "Daniel" ? "selected" : "";
    let option = `<option value="${voice.name}" ${selected}>${voice.name} (${voice.lang})</option>`;
    voiceList.insertAdjacentHTML("beforeend", option);
  }
}

synth.addEventListener("voiceschanged", voices);

function textToSpeech(text) {
  let utterance = new SpeechSynthesisUtterance(text);
  for (let voice of synth.getVoices()) {
    if (voice.name === voiceList.value) {
      utterance.voice = voice;
    }
  }

  utterance.addEventListener("end", () => {
    isSpeaking = false;
    speechBtn.innerText = "Convert To Speech";
  });

  synth.speak(utterance);
}

speechBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (textarea.value !== "") {
    if (!synth.speaking && !isSpeaking) {
      textToSpeech(textarea.value);
      isSpeaking = true;
      speechBtn.innerText = "Pause Speech";
    } else {
      if (textarea.value.length > 80) {
        if (!isSpeaking) {
          synth.resume();
          isSpeaking = true;
          speechBtn.innerText = "Pause Speech";
        } else {
          synth.pause();
          isSpeaking = false;
          speechBtn.innerText = "Resume Speech";
        }
      }
    }
  }
});
