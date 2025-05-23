import React from "react";
import AdminUploadForm from "./AdminUploadForm";
import AdminQuestionList from "./AdminQuestionList";

const AdminDashboard = () => {
  const [refreshKey, setRefreshKey] = React.useState(0);

  return (
    <div>
      <AdminUploadForm onUploadSuccess={() => setRefreshKey((prev) => prev + 1)} />
      <AdminQuestionList key={refreshKey} />
    </div>
  );
};

export default AdminDashboard;
