import { Posts } from "./Posts";
import "./App.css";
import { QueryClient, QueryClientProvider } from "react-query";

// 클라이언트 생성 => 공급자 추가 가능
const queryClient = new QueryClient();

function App() {
  return (
    // provide React Query client to App
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <h1>Blog Posts</h1>
        <Posts />
      </div>
    </QueryClientProvider>
  );
}

export default App;
