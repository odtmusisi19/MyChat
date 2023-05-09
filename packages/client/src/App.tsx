import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { trpc } from './trpc';

import './index.scss';

const client = new QueryClient();

const AppContent = () => {
  const getMessages = trpc.useQuery(['getMessages']);

  const [user, setUser] = useState('');
  const [message, setMessage] = useState('');
  const addMessage = trpc.useMutation('addMessage');
  const onAdd = () => {
    addMessage.mutate(
      {
        message,
        user,
      },
      {
        onSuccess: () => {
          client.invalidateQueries(['getMessages']);
        },
      }
    );
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto bg-gray-100 mb-10">
        <ul className="p-4">
          {(getMessages.data ?? []).map((row) => (
            <div key={row.message}>
              <div className="bg-white w-1/2 rounded-lg shadow-lg p-4 mt-2">
                <p className="text-gray-800 font-bold mb-2">{((matchResult) => matchResult && matchResult[1])(JSON.stringify(row).match(/"user":"([^,"]+)"/))}</p>
                <p className="text-gray-700 text-sm">{((matchResult) => matchResult && matchResult[1])(JSON.stringify(row).match(/"message":"([^"]+)"/))}</p>
              </div>
              {/* <div className="border-2 mt-5 p-5 rounded-lg" onClick={onAdd}>
                  {((matchResult) => matchResult && matchResult[1])(JSON.stringify(row).match(/"user":"([^,"]+)"/))}
                </div> */}
              {/* <div className="border-2 mt-5 p-5 rounded-lg" onClick={onAdd}>
                {((matchResult) => matchResult && matchResult[1])(JSON.stringify(row).match(/"message":"([^"]+)"/))}
              </div> */}
            </div>
          ))}
        </ul>
      </div>
      <div className="fixed bottom-5 bg-white rounded-lg">
        <div className="mt-10">
          <input required type="text" value={user} onChange={(e) => setUser(e.target.value)} className="p-5 border-2 border-gray-300 rounded-lg w-full" placeholder="User" />
          <input required type="text" value={message} onChange={(e) => setMessage(e.target.value)} className="p-5 mt-5 border-2 border-gray-300 rounded-lg w-full" placeholder="Message" />
        </div>

        <button type="submit" className="border-2 mt-5 p-5 rounded-lg bg-black text-white" onClick={onAdd}>
          Add message
        </button>
      </div>
    </div>
  );
};

const App = () => {
  const [trpcClient] = useState(() =>
    trpc.createClient({
      url: 'http://localhost:8080/trpc',
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={client}>
      <QueryClientProvider client={client}>
        <AppContent />
      </QueryClientProvider>
    </trpc.Provider>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
