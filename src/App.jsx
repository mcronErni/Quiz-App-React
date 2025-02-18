import { useSelector } from "react-redux";
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import UserDashboard from './pages/UserDashboard';
import MentorDashboard from './pages/MentorDashboard';
import Login from './pages/Login';
import AvailableQuizzes from './pages/AvailableQuizzes';
import IndividualQuiz from './pages/IndividualQuiz';
import CreateQuiz from './pages/CreateQuiz';
import UserLayout from './layouts/UserLayout';
import MentorLayout from './layouts/MentorLayout';
import ViewCreatedQuizzes from './pages/ViewCreatedQuizzes';
import PrivateRoute from "./layouts/PrivateRoute";
import Register from "./pages/Register";
import EditQuiz from "./pages/EditQuiz";
import MentorViewQuiz from "./pages/MentorViewQuiz";

function App() {
  const { role, mentorName, bootcamperName, isAuthenticated, mentorId, bootcamperId } = useSelector(state => state.auth);

  console.log("App User: ", role);
  console.log("Mentor Name: ", mentorName);
  console.log("Mentor Id: ", mentorId);
  console.log("Bootcamper Id: ", bootcamperId);
  console.log("Bootcamper Name: ", bootcamperName);
  console.log("Is Authenticated: ", isAuthenticated);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={!isAuthenticated ? <Login /> : <Navigate to={role === "mentor" ? "/mentor" : "/user"} />}
        />
        <Route path="register" element={<Register />} />

        <Route element={<PrivateRoute allowedRoles={["bootcamper"]} />}>
          <Route path='user' element={<UserLayout />}>
            <Route index element={<UserDashboard />} />
            <Route path='available-quizzes' element={<AvailableQuizzes />} />
            <Route path='available-quizzes/:id' element={<IndividualQuiz />} />
          </Route>
        </Route>

        <Route element={<PrivateRoute allowedRoles={["mentor"]} />}>
          <Route path='mentor' element={<MentorLayout />}>
            <Route index element={<MentorDashboard />} />
            <Route path='create-quiz' element={<CreateQuiz />} />
            <Route path='view-quiz' element={<ViewCreatedQuizzes />} />
            <Route path='view-quiz/:id' element={<MentorViewQuiz />} />
            <Route path='view-quiz/edit/:id' element={<EditQuiz />} />
          </Route>
        </Route>

        <Route path='about' element={<p>This is about page</p>} />
        <Route path='*' element={<p>No page found</p>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
