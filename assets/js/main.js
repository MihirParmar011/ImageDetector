// DOM Elements
const fileInput = document.getElementById("fileInput");
const imagePreview = document.getElementById("imagePreview");
const resultDiv = document.getElementById("result");
const uploadButton = document.getElementById("uploadButton");

// Show Image Preview
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.src = e.target.result;
      imagePreview.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});

// Handle Upload and Display Results
uploadButton.addEventListener("click", async () => {
  if (!fileInput.files.length) {
    resultDiv.innerHTML =
      "<div class='alert alert-warning'>Please select an image.</div>";
    return;
  }

  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append("media", file);
  formData.append(
    "models",
    "nudity-2.1,weapon,alcohol,recreational_drug,medical,offensive,text-content,gore-2.0,violence,self-harm"
  );
  formData.append("api_user", "1873443712");
  formData.append("api_secret", "DuadTBRL36vbWJRF7wAe7vsSAUJmBC6d");

  try {
    resultDiv.innerHTML =
      "<div class='text-center'><div class='spinner-border' role='status'></div><p>Uploading...</p></div>";
    const response = await axios.post(
      "https://api.sightengine.com/1.0/check.json",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    displayResponse(response.data);
  } catch (error) {
    resultDiv.innerHTML = `<div class='alert alert-danger'>Error: ${error.message}</div>`;
  }
});

// Render Results Dynamically
function displayResponse(data) {
  resultDiv.innerHTML = ""; // Clear previous results

  Object.keys(data).forEach((key) => {
    const value = data[key];

    // Ignore unnecessary keys
    if (key === "status" || key === "request" || key === "media") {
      return;
    }

    if (typeof value === "object") {
      const category = document.createElement("div");
      category.classList.add("mb-3");

      const header = document.createElement("h5");
      header.textContent = capitalize(key);
      header.classList.add("bg-primary", "text-white", "p-2", "rounded");
      category.appendChild(header);

      const list = document.createElement("ul");
      Object.keys(value).forEach((subKey) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${capitalize(subKey)}: ${(
          value[subKey] * 100
        ).toFixed(2)}%`;
        list.appendChild(listItem);
      });

      category.appendChild(list);
      resultDiv.appendChild(category);
    } else {
      const item = document.createElement("p");
      item.innerHTML = `<strong>${capitalize(key)}</strong>: ${(value * 100).toFixed(2)}%`;
      resultDiv.appendChild(item);
    }
  });
}

// Capitalize Helper
function capitalize(str) {
  return str
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
