import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
from main import FEATURE_NAMES, holland_questions, personality_info, model, numeric_to_category


st.set_page_config(page_title="Career Recommendation", layout="wide")

st.title("Career Recommendation System")

tab1, tab2 = st.tabs(["Personality Test", "Course Prediction"])

with tab1:
    st.header("Holland RIASEC Personality Test")

    with st.form("personality_form"):
        answers = {}
        for ptype, questions in holland_questions.items():
            st.subheader(f"{personality_info[ptype]['name']} ({ptype})")
            answers[ptype] = []
            for q in questions:
                val = st.radio(q, options=[0, 1, 2, 3, 4], index=2, key=f"{ptype}_{questions.index(q)}")
                answers[ptype].append(int(val))

        submitted = st.form_submit_button("Submit Test")

    if submitted:
        cumulative_scores = {ptype: sum(vals) for ptype, vals in answers.items()}
        dominant = max(cumulative_scores, key=cumulative_scores.get)
        st.success(f"Dominant type: {personality_info[dominant]['name']}")
        st.write(personality_info[dominant]['description'])
        st.write("Recommended careers:")
        for c in personality_info[dominant]['careers']:
            st.write("- ", c)

        # Pie/donut chart
        scores = list(cumulative_scores.values())
        labels = [personality_info[k]['name'] for k in cumulative_scores.keys()]
        fig, ax = plt.subplots()
        ax.pie(scores, labels=labels, autopct="%1.1f%%", startangle=90)
        centre = plt.Circle((0, 0), 0.70, fc='white')
        fig.gca().add_artist(centre)
        ax.axis('equal')
        st.pyplot(fig)

with tab2:
    st.header("Predict Course from Interests")

    st.write("Select interests (checked = 1)")
    cols = st.columns(4)
    selections = {}
    for i, feature in enumerate(FEATURE_NAMES):
        col = cols[i % 4]
        selections[feature] = col.checkbox(feature, key=f"feat_{i}")

    if st.button("Predict Course"):
        user_input = {f: int(bool(selections.get(f, 0))) for f in FEATURE_NAMES}
        user_df = pd.DataFrame([user_input])
        try:
            pred = model.predict(user_df)
            numeric = int(pred[0])
            course = numeric_to_category.get(numeric, "Unknown")
            st.success(f"Recommended course: {course}")
        except Exception as e:
            st.error(f"Prediction error: {e}")
