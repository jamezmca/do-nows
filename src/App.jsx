import { useState } from "react";

class Topic {
  constructor(name, lessonNumber) {
    this.name = name;
    this.lastReviewedLesson = lessonNumber;
    this.interval = 1;
    this.recallScore = 3;
  }

  updateRecall(lessonNumber, score) {
    this.recallScore = score;
    this.interval = Math.max(1, Math.round(this.interval * Math.exp(score - 3)));
    this.lastReviewedLesson = lessonNumber;
  }

  isDueForReview(currentLesson) {
    return (currentLesson - this.lastReviewedLesson) >= this.interval;
  }
}

export default function App() {
  const [lessons, setLessons] = useState([]);
  const [lessonInput, setLessonInput] = useState("");
  const [topicsInput, setTopicsInput] = useState("");
  const [schedule, setSchedule] = useState([]);

  const addLesson = () => {
    if (!lessonInput.trim() || !topicsInput.trim()) return;

    const topics = topicsInput.split(",").map(topic => new Topic(topic.trim(), lessons.length + 1));
    setLessons([...lessons, { lessonNumber: lessons.length + 1, topics, lessonInput }]);

    setLessonInput("");
    setTopicsInput("");
  };

  const generateSchedule = () => {
    let allTopics = [];
    let lessonPlan = [];

    lessons.forEach(lesson => {
      lesson.topics.forEach(topic => allTopics.push(topic));
    });

    lessons.forEach(lesson => {
      let dueTopics = allTopics
        .filter(topic => topic.isDueForReview(lesson.lessonNumber))
        .slice(0, 2);

      dueTopics.forEach(topic => topic.updateRecall(lesson.lessonNumber, 4));

      lessonPlan.push({ lessonNumber: lesson.lessonNumber, recallTopics: dueTopics.map(t => t.name) });
    });

    setSchedule(lessonPlan);
  };

  console.log(lessons)

  return (
    <>
      <header>
        <h1 className="special-shadow">Do Nows | Planner</h1>
      </header>
      <main>

        <section className="">
          <h3>Plan your lessons</h3>
          <input
            type="text"
            placeholder="Lesson Name"
            value={lessonInput}
            onChange={e => setLessonInput(e.target.value)}
          />
          <input
            type="text"
            placeholder="Topics (comma-separated)"
            value={topicsInput}
            onChange={e => setTopicsInput(e.target.value)}
          />
          <button className="button-card" onClick={addLesson}>Add Lesson</button>
        </section>
        <section className="lesson-plan">
          {lessons.map((less, lessIndex) => {
            return (
              <div className="card" key={lessIndex}>
                <h6>
                  {lessIndex + 1}. {less.lessonInput}
                </h6>
                <div className="topics-container">
                  {less.topics.map((topic, topicIndex) => {
                    return (
                      <div key={topicIndex} className="card-button-primary">
                        <p>{topic.name}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </section>
        <button className="generate-btn" onClick={generateSchedule}><h6>Generate Schedule</h6></button>
        <div className="full-line" />
        <section>
          {schedule.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Lesson</th>
                  <th>Do Nows</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((entry, index) => (
                  <tr key={index}>
                    <td>Lesson {entry.lessonNumber}</td>
                    <td>{entry.recallTopics.length > 0 ? entry.recallTopics.join(", ") : "None"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </>
  );
}
