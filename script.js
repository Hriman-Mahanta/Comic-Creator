// The query function for making API requests
async function query(data) {
  const response = await fetch(
    "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
    {
      headers: {
        Accept: "image/png",
        Authorization:
          "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.blob();
  return result;
}

// Event listener for form submission
document
  .getElementById("comicForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    // Get the comma-separated string from the input field
    let panelTexts = document.getElementById("panelTexts").value;
    let comicData = panelTexts.split(",").map((text) => text.trim());

    // Clear previous output and errors
    document.getElementById("comicOutput").innerHTML = "";
    document.getElementById("errorOutput").innerText = "";

    // Send data to API and display images
    for (let text of comicData) {
      // Create a placeholder for the loading state
      let loadingPlaceholder = document.createElement("div");
      loadingPlaceholder.innerText = "Loading...";
      loadingPlaceholder.className = "loading-placeholder";
      document.getElementById("comicOutput").appendChild(loadingPlaceholder);

      try {
        let imageBlob = await query({ inputs: text });
        if (!imageBlob.size) {
          throw new Error("Empty response from API");
        }
        let imageUrl = URL.createObjectURL(imageBlob);

        // Create an image element
        let img = document.createElement("img");
        img.src = imageUrl;
        img.className = "panel-image";
        img.onload = () => {
          // Replace the loading placeholder with the image
          document
            .getElementById("comicOutput")
            .replaceChild(img, loadingPlaceholder);
        };
      } catch (error) {
        console.error("Error generating image:", error);
        document.getElementById("errorOutput").innerText +=
          'Error generating image for text: "' +
          text +
          '": ' +
          error.message +
          "\n";
        // Remove the loading placeholder if there is an error
        loadingPlaceholder.remove();
      }
    }
  });
