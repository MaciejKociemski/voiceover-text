const textarea = document.querySelector("textarea"),
  voiceList = document.querySelector("select"),
  speechBtn = document.querySelector("button");

let synth = window.speechSynthesis, // Używamy window.speechSynthesis dla kompatybilności z Androidem
  isSpeaking = false;

textarea.value = `Silent night, holy night,
All is calm, all is bright.
Round yon Virgin, Mother and Child,
Holy infant so tender and mild.`;

voices();

async function voices() {
  return new Promise((resolve) => {
    let voicesInterval = setInterval(() => {
      const voices = synth.getVoices();
      if (voices.length !== 0) {
        clearInterval(voicesInterval);
        for (let voice of voices) {
          let selected = voice.name === "Daniel" ? "selected" : "";
          let option = `<option value="${voice.name}" ${selected}>${voice.name} (${voice.lang})</option>`;
          voiceList.insertAdjacentHTML("beforeend", option);
        }
        resolve();
      }
    }, 500);
  });
}

synth.addEventListener("voiceschanged", voices);

async function textToSpeech(text) {
  await voices(); // Czekamy, aż głosy zostaną załadowane

  return new Promise((resolve) => {
    let utterance = new SpeechSynthesisUtterance(text);
    for (let voice of synth.getVoices()) {
      if (voice.name === voiceList.value) {
        utterance.voice = voice;
      }
    }

    utterance.addEventListener("end", () => {
      isSpeaking = false;
      speechBtn.innerText = "Convert To Speech";
      resolve();
    });

    synth.speak(utterance);
  });
}

speechBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  if (textarea.value !== "") {
    if (!synth.speaking && !isSpeaking) {
      await textToSpeech(textarea.value);
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
