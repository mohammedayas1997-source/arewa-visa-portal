import React, { useState } from "react";
import { firestore } from "../firebase";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { CheckCircle, Loader2, BookOpen } from "lucide-react";

const CourseSelection = ({ currentUser, coursesData, onSelectionSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = async (courseTitle, courseId) => {
    setLoading(true);
    setSelectedId(courseId);

    try {
      // 1. Nemo Application din dalibin ta Email (Query)
      const q = query(
        collection(firestore, "applications"),
        where("email", "==", currentUser.email)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // 2. Dauko ainihin Doc ID na Firestore
        const appDoc = querySnapshot.docs[0];
        const appRef = doc(firestore, "applications", appDoc.id);

        // 3. Yi Update na Course din
        await updateDoc(appRef, {
          selectedCourseTitle: courseTitle,
          courseSelectionDate: new Date().toISOString(),
          status: "Course Selected"
        });

        alert(`Successfully selected: ${courseTitle}`);
        if (onSelectionSuccess) onSelectionSuccess();
      } else {
        alert("Error: No application record found for your email. Please contact Admin.");
      }
    } catch (error) {
      console.error("Selection Error:", error);
      alert("Failed to update course. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h3 className="fw-bold mb-4 text-uppercase d-flex align-items-center gap-2">
        <BookOpen className="text-danger" /> Select Your Specialization
      </h3>
      <div className="row g-3">
        {coursesData.map((course) => (
          <div key={course.id} className="col-md-6 col-lg-4">
            <div 
              className={`card h-100 border-0 shadow-sm rounded-4 p-3 transition-all ${selectedId === course.id ? 'ring-2 ring-danger' : ''}`}
              style={{ cursor: "pointer", border: "1px solid #eee" }}
              onClick={() => !loading && handleSelect(course.title, course.id)}
            >
              <div className="d-flex justify-content-between align-items-start">
                <div className="bg-light p-2 rounded-3 mb-3">
                  {/* Zaka iya saka icon na course anan */}
                  <CheckCircle size={20} className={selectedId === course.id ? "text-danger" : "text-muted"} />
                </div>
                {loading && selectedId === course.id && <Loader2 className="animate-spin text-danger" size={20} />}
              </div>
              <h6 className="fw-bold mb-1 uppercase" style={{ fontSize: "14px" }}>{course.title}</h6>
              <p className="small text-muted mb-0">Professional Certification Program</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseSelection;