function ShowCourses({ courses }) {
  return (
    <div>
      <h1 className="text-3xl font-bold ">Courses</h1>
      <div>
        {courses.map((courseName) => {
          {
            /* const course = userData.courses[courseName]; // Get course details */
          }
          return (
            <ul className="list-disc pl-6 pt-2.5" key={courseName}>
              <li className="text-2xl font-semibold">{courseName}</li>
            </ul>
          );
        })}
      </div>
    </div>
  );
}

export default ShowCourses;
