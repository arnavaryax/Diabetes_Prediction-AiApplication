# Diabetes Prediction Web Application

An educational machine-learning web application created for a Project Based
Learning assignment in the **AI Applications** subject at
**Chandigarh University**.

The application provides a polished frontend where users can enter health
related values and request a diabetes prediction from a remote API. It is
intended to demonstrate a machine-learning classification workflow, not to
provide medical diagnosis or treatment advice.

## Features

- Responsive multi-page website with a glassmorphism-style interface.
- Prediction form with client-side browser validation.
- Eight health-related input features:
  - Pregnancies
  - Glucose
  - Blood Pressure
  - Skin Thickness
  - Insulin
  - BMI
  - Diabetes Pedigree Function
  - Age
- Asynchronous request to a prediction API.
- Displays:
  - Predicted outcome
  - Prediction probability
  - Animated probability progress bar
- Loading, error, and reset states.
- Project overview, workflow, dataset, team, and disclaimer pages.
- Decorative animated backgrounds, hover effects, and scroll-based navigation
  effects.

## Running the Project

This is a frontend-only project and does not contain a package manifest or
build configuration.

### Option 1: Open directly

Open `index.html` in a modern web browser.

### Option 2: Use a local static server

Serving the files through a local HTTP server is recommended:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Prediction API

The frontend sends a `POST` request to the following endpoint configured in
`script.js`:

```text
https://washer-backspace-eastward.ngrok-free.dev/predict
```

The request body is JSON with the following shape:

```json
{
  "Pregnancies": 2,
  "Glucose": 120,
  "BloodPressure": 70,
  "SkinThickness": 25,
  "Insulin": 100,
  "BMI": 28.5,
  "DiabetesPedigreeFunction": 0.35,
  "Age": 25
}
```

The frontend expects a successful response containing numeric `prediction` and
`probability` properties:

```json
{
  "prediction": 0,
  "probability": 0.24
}
```

- `prediction` should be `0` or `1`.
- `probability` is expected to be a decimal value that is converted to a
  percentage in the interface.
- Non-successful responses should provide an optional `error` message.

The remote tunnel/API must be running and accessible for predictions to work.
If it is unavailable, the page displays an error message.

## How the Workflow Works

1. The user enters the eight required input values.
2. The browser validates that each value is present, numeric, and non-negative.
3. The values are sent to the prediction API as JSON.
4. The backend preprocessing and trained classification model process the
   inputs.
5. The returned prediction and probability are shown in the result card.

The project documentation describes Logistic Regression and Random Forest as
the evaluated classification approaches. It also references the PIMA Indians
Diabetes Dataset, which contains 768 records, eight input features, and two
classes.

## Team

The project page identifies the following team members:

- **Arnav Arya** — UID: `26BCS10115`
- **Gautam Raj** — UID: `26BCS10118`
- **Ankit Dadhwal** — UID: `26BCS10121`

All members are listed under **Section 201B**.

## Important Disclaimer

This project is for educational demonstration only.

- It is not a medical diagnosis or a substitute for professional medical
  advice.
- Predictions can be inaccurate and must not be used to start, stop, or
  change treatment.
- Users should not enter personally identifiable or sensitive medical
  information.
- Health-related decisions should be made with a qualified healthcare
  professional.