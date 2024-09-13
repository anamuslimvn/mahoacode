     
        const baseUrl = 'https://quranenc.com/api/v1/translation/sura/';
        const audioBaseUrl = 'https://everyayah.com/data/Alafasy_128kbps/';
        const homePageUrl = 'toiyeuislam.com';
        let isPlaying = false;
        let currentVerseDetails = {};
        let currentLanguage = 'vietnamese_rwwad';

        async function fetchRandomSura() {
            const suraNumber = Math.floor(Math.random() * 114) + 1;
            const response = await fetch(`${baseUrl}${currentLanguage}/${suraNumber}`);
            const data = await response.json();
            return data.result || [];
        }

        async function displayRandomVerse() {
            const contentDiv = document.getElementById('content');
            contentDiv.innerHTML = '<p class="textnhac">Đang tải câu kinh, vui lòng chờ đợi!</p>';

            const suraVerses = await fetchRandomSura();
            if (!suraVerses.length) {
                contentDiv.innerHTML = '<p class="textnhac">Hãy bấm lại!</p>';
                return;
            }

            const validVerses = suraVerses.filter(v => v.translation.split(' ').length > 30);
            if (!validVerses.length) {
                contentDiv.innerHTML = '<p class="textnhac">Hãy bấm lại!</p>';
                return;
            }

            const randomVerse = validVerses[Math.floor(Math.random() * validVerses.length)];
            currentVerseDetails = {
                sura: randomVerse.sura,
                aya: randomVerse.aya,
                translation: randomVerse.translation,
                arabic_text: randomVerse.arabic_text
            };

            const verseDiv = document.createElement('div');
            verseDiv.className = 'verserandom';

            verseDiv.innerHTML = `
                <div class="ayat">
                    <div class="language-buttons">
                        <button class="language-button active" id="btnVi" onclick="loadTranslation('vietnamese_rwwad')">Vi</button>
                        <button class="language-button" id="btnEn" onclick="loadTranslation('english_rwwad')">En</button>
                    </div>
                    <div class="ayat-details">Chương ${randomVerse.sura}, Câu ${randomVerse.aya}</div>
                    <div class="action-buttons">
                        <div class="icon-audio" onclick="toggleAudio()">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                                <path id="audioIconPath" d="m5 3 14 9-14 9V3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                        </div>
                        <div class="copy-button" id="copyButton" onclick="copyVerse()">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                        </div>
                    </div>
                </div>
                <p class="quranarrandom">${randomVerse.arabic_text}</p>
                <p class="quranvirandom" id="verseTranslation">${randomVerse.translation}</p>
            `;

            contentDiv.innerHTML = '';
            contentDiv.appendChild(verseDiv);

            document.getElementById('audioPlayer').src = `${audioBaseUrl}${randomVerse.sura.toString().padStart(3, '0')}${randomVerse.aya.toString().padStart(3, '0')}.mp3`;
        }

        async function loadTranslation(language) {
            currentLanguage = language;
            const suraNumber = currentVerseDetails.sura;
            const ayaNumber = currentVerseDetails.aya;
            const response = await fetch(`${baseUrl}${currentLanguage}/${suraNumber}`);
            const data = await response.json();
            const verse = data.result.find(v => v.aya === ayaNumber);
            const translationElement = document.getElementById('verseTranslation');
            translationElement.textContent = verse.translation;

            document.getElementById('btnVi').classList.toggle('active', language === 'vietnamese_rwwad');
            document.getElementById('btnEn').classList.toggle('active', language === 'english_saheeh');
        }

        function toggleAudio() {
            const audioPlayer = document.getElementById('audioPlayer');
            const audioIconPath = document.getElementById('audioIconPath');
            if (isPlaying) {
                audioPlayer.pause();
                audioIconPath.setAttribute('d', 'm5 3 14 9-14 9V3Z');
            } else {
                audioPlayer.play();
                audioIconPath.setAttribute('d', 'M5 4v16l14-8L5 4z');
            }
            isPlaying = !isPlaying;
        }

        function copyVerse() {
            const translation = document.getElementById('verseTranslation').textContent;
            const textToCopy = `${translation}\n\Quran ${currentVerseDetails.sura}: ${currentVerseDetails.aya}\n\nLink: ${homePageUrl}`;
            navigator.clipboard.writeText(textToCopy)
                .catch(err => console.error('Lỗi khi sao chép đoạn văn: ', err));
        }

        // Gọi hàm để hiển thị câu kinh ngẫu nhiên khi trang được tải
        document.addEventListener('DOMContentLoaded', () => {
            displayRandomVerse();
        });
      
      

