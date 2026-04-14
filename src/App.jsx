import { useEffect, useState } from 'react';
import { getAllRecords, insertNewRecord, deleteRecord } from './utils/db';
import { useCallback } from 'react';

function App() {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [newStudyDetail, setNewStudyDetail] = useState('');
  const [newStudyHour, setNewStudyHour] = useState('');
  const [error, setError] = useState('');

  const totalTime = records.reduce(
    (accumulator, currentValue) => accumulator + parseInt(currentValue.time),
    0
  );

  const onChangeStudyDetailInput = (event) =>
    setNewStudyDetail(event.target.value);
  const onChangeStudyHourInput = (event) => setNewStudyHour(event.target.value);

  const onClickAdd = async () => {
    if (newStudyDetail === '' || newStudyHour === '') {
      setError('入力されていないの項目があります');
      return;
    }
    setError('');

    const newRecord = { title: newStudyDetail, time: newStudyHour };

    await insertNewRecord(newRecord);
    await getRecords();

    setNewStudyDetail('');
    setNewStudyHour('');
  };

  const onClickDelete = async (id) => {
    await deleteRecord(id);
    await getRecords();
  } 

  const getRecords = useCallback(async () => {
    setIsLoading(true);
    const records = await getAllRecords();
    setRecords(records);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    getRecords();
  }, [getRecords]);

  return (
    <>
      <h1>学習記録あぷり</h1>
      <div>
        <div>
          学習内容
          <input
            value={newStudyDetail}
            onChange={onChangeStudyDetailInput}
          ></input>
        </div>
        <div>
          学習時間
          <input
            type="number"
            value={newStudyHour}
            onChange={onChangeStudyHourInput}
          ></input>
          時間
        </div>
        <div>
          <p>入力されている学習内容：{newStudyDetail}</p>
          <p>入力されている学習時間：{newStudyHour}時間</p>
        </div>
      </div>
      <div>
        {isLoading ? (<p>読み込み中…</p>) : (
        <ul>
          {records.map((item, id) => {
            return (
              <li key={id}>
                <div>
                  {item.title} {item.time}時間
                  <button onClick={() => onClickDelete(item.id)}>削除</button>
                </div>
              </li>
            );
          })}
        </ul>
        )}
        <div>
          <button onClick={onClickAdd}>登録</button>
          {error && '入力されていない項目があります'}
        </div>
        <div>
          <p>合計時間 {totalTime} / 1000 (h)</p>
        </div>
      </div>
    </>
  );
}

export default App;
