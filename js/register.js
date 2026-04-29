console.log("Register.js loaded");

document.getElementById("registerForm")
    .addEventListener("submit", async (e) => {
        //hier schreiben wir, was beim submit passiert

        e.preventDefault(); //verhindert, dass die Seite neu geladen wird
        console.log("Form submitted");

        const email = document.getElementById("email").value.trim();

        const password = document.getElementById("password").value.trim();

        console.log(email + " " + password);

        try {
            const response = await fetch("api/register.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error("Error:", error);
            alert("Error:", error);
        }
    });