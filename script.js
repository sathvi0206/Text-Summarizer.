```javascript
const textInput = document.getElementById("textInput");

const wordCount = document.getElementById("wordCount");

const charCount = document.getElementById("charCount");


// Update word and character count

textInput.addEventListener("input", function () {

    const text = textInput.value.trim();

    const words = text === ""
        ? []
        : text.split(/\s+/);

    wordCount.textContent =
        words.length + " words";

    charCount.textContent =
        text.length + " characters";
});


// Summarize text

function summarizeText() {

    const text = textInput.value.trim();

    if (text === "") {

        alert("Please enter some text first.");

        return;
    }

    const sentences = splitSentences(text);

    if (sentences.length === 1) {

        showSummary(
            sentences[0],
            countWords(text),
            countWords(sentences[0])
        );

        return;
    }

    // Calculate word frequency

    const frequency = getWordFrequency(text);

    // Calculate score for every sentence

    const scoredSentences = sentences.map(function (sentence, index) {

        const words =
            sentence.toLowerCase()
                .match(/[a-zA-Z]+/g) || [];

        let score = 0;

        words.forEach(function (word) {

            if (frequency[word]) {
                score += frequency[word];
            }

        });

        // Give a small bonus to the beginning
        // of the text

        if (index === 0) {
            score += 2;
        }

        return {
            sentence: sentence,
            score: score,
            index: index
        };

    });

    // Number of sentences to select

    let numberOfSentences;

    if (sentences.length <= 3) {
        numberOfSentences = 1;
    } else if (sentences.length <= 6) {
        numberOfSentences = 2;
    } else {
        numberOfSentences =
            Math.ceil(sentences.length * 0.35);
    }

    // Sort according to score

    scoredSentences.sort(function (a, b) {

        return b.score - a.score;

    });

    // Select important sentences

    const selected =
        scoredSentences
            .slice(0, numberOfSentences)
            .sort(function (a, b) {

                return a.index - b.index;

            });

    const summary =
        selected
            .map(function (item) {
                return item.sentence;
            })
            .join(" ");

    showSummary(
        summary,
        countWords(text),
        countWords(summary)
    );
}


// Split text into sentences

function splitSentences(text) {

    return text
        .match(/[^.!?]+[.!?]+|[^.!?]+$/g)
        .map(function (sentence) {

            return sentence.trim();

        })
        .filter(function (sentence) {

            return sentence.length > 0;

        });
}


// Count words

function countWords(text) {

    if (!text.trim()) {
        return 0;
    }

    return text
        .trim()
        .split(/\s+/)
        .length;
}


// Get important word frequency

function getWordFrequency(text) {

    const stopWords = new Set([

        "the",
        "is",
        "are",
        "was",
        "were",
        "a",
        "an",
        "and",
        "or",
        "but",
        "of",
        "to",
        "in",
        "on",
        "for",
        "with",
        "by",
        "from",
        "as",
        "at",
        "this",
        "that",
        "these",
        "those",
        "it",
        "its",
        "be",
        "been",
        "being",
        "has",
        "have",
        "had",
        "do",
        "does",
        "did",
        "will",
        "would",
        "can",
        "could",
        "should",
        "may",
        "might",
        "must",
        "not",
        "you",
        "your",
        "we",
        "our",
        "they",
        "their",
        "he",
        "she",
        "his",
        "her",
        "I",
        "me",
        "my",
        "more",
        "most",
        "very",
        "also",
        "there",
        "which",
        "who",
        "what",
        "when",
        "where",
        "how"
    ]);

    const words =
        text.toLowerCase()
            .match(/[a-zA-Z]+/g) || [];

    const frequency = {};

    words.forEach(function (word) {

        if (
            word.length < 3 ||
            stopWords.has(word)
        ) {
            return;
        }

        if (frequency[word]) {

            frequency[word]++;

        } else {

            frequency[word] = 1;
        }

    });

    return frequency;
}


// Display summary

function showSummary(
    summary,
    originalWordCount,
    summaryWordCount
) {

    const summaryBox =
        document.getElementById("summaryBox");

    const summaryInfo =
        document.getElementById("summaryInfo");

    summaryBox.innerHTML =
        "<p>" + escapeHTML(summary) + "</p>";

    summaryInfo.textContent =
        "Summary generated";

    document.getElementById("originalWords")
        .textContent = originalWordCount;

    document.getElementById("summaryWords")
        .textContent = summaryWordCount;

    let reduction = 0;

    if (originalWordCount > 0) {

        reduction =
            Math.round(
                ((originalWordCount - summaryWordCount)
                / originalWordCount) * 100
            );

    }

    if (reduction < 0) {
        reduction = 0;
    }

    document.getElementById("reduction")
        .textContent = reduction + "%";
}


// Clear everything

function clearText() {

    textInput.value = "";

    wordCount.textContent = "0 words";

    charCount.textContent = "0 characters";

    document.getElementById("summaryBox")
        .innerHTML =
        '<p class="placeholder">' +
        'Your summary will appear here...' +
        '</p>';

    document.getElementById("summaryInfo")
        .textContent = "Ready";

    document.getElementById("originalWords")
        .textContent = "0";

    document.getElementById("summaryWords")
        .textContent = "0";

    document.getElementById("reduction")
        .textContent = "0%";
}


// Protect displayed text

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}
```
