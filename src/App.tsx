import { BoardProvider } from './context/BoardContext';
import { BoardHeader } from './components/Board/BoardHeader';
import { Board } from './components/Board/Board';

function App() {
  return (
    <BoardProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <BoardHeader />
        <Board />
      </div>
    </BoardProvider>
  );
}

export default App;