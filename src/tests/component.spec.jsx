import App from "../App";
import React from "react";
import '@testing-library/jest-dom'
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("../utils/db", () => ({
  getAllRecords: jest.fn(),
  insertNewRecord: jest.fn(),
  deleteRecord: jest.fn(),
}));

import { getAllRecords, insertNewRecord, deleteRecord } from "../utils/db";

describe("Title Test", () => {
  beforeEach(() => {
    getAllRecords.mockResolvedValue([]);
  });

  it("タイトルが学習記録アプリであること", async () => {
    render(<App />);
    // 非同期の状態更新が完了するまで待つ
    await waitFor(() => expect(screen.queryByTestId("loading-text")).not.toBeInTheDocument());
    expect(screen.getByTestId("title")).toHaveTextContent("学習記録アプリ");
  });
});

describe("登録テスト", () => {
  beforeEach(() => {
    // 初期状態：レコードなし
    getAllRecords.mockResolvedValueOnce([]);
    // 登録後：追加されたレコードを返す
    getAllRecords.mockResolvedValueOnce([
      { id: 1, title: "React", time: "3" }
    ]);
    insertNewRecord.mockResolvedValue(undefined);
  });

  it("入力した内容が登録ボタンを押すとリストに追加されること", async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => expect(screen.queryByTestId("loading-text")).not.toBeInTheDocument());

    // 学習内容と学習時間を入力して登録
    await user.type(screen.getByTestId("study-detail-input"), "React");
    await user.type(screen.getByTestId("study-hour-input"), "3");
    await user.click(screen.getByRole("button", { name: "登録" }));

    // リストに追加されていることを確認
    await waitFor(() => expect(screen.getByText(/React.*3時間/)).toBeInTheDocument());
  });
});

describe("削除テスト", () => {
  beforeEach(() => {
    getAllRecords.mockResolvedValueOnce([
      { id: 1, title: "React", time: "3" }
    ]);
    getAllRecords.mockResolvedValueOnce([]);
    deleteRecord.mockResolvedValue(undefined);
  });

  it("削除ボタンを押すとリストから削除されること", async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => expect(screen.queryByTestId("loading-text")).not.toBeInTheDocument());
    await user.click(screen.getByTestId("delete-button"));

    // deleteRecordが正しいIDで呼ばれたことを確認
    expect(deleteRecord).toHaveBeenCalledWith(1);

    // 画面からも消えていることを確認
    await waitFor(() => expect(screen.queryByTestId("delete-button")).not.toBeInTheDocument());
  });
});

describe("未入力登録テスト", () => {
  beforeEach(() => {
    getAllRecords.mockResolvedValueOnce([]);
    insertNewRecord.mockResolvedValue(undefined);
  });

  it.each([
    ["学習内容のみ未入力", "", "3"],
    ["学習時間のみ未入力", "React", ""],
    ["学習内容と学習時間両方未入力", "", ""]
  ])("%sの場合エラーメッセージが表示されること", async (_, detail, hour) => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => expect(screen.queryByTestId("loading-text")).not.toBeInTheDocument());

    if (detail) await user.type(screen.getByTestId("study-detail-input"), detail);
    if (hour) await user.type(screen.getByTestId("study-hour-input"), hour);
    await user.click(screen.getByRole("button", { name: "登録" }));

    await waitFor(() => expect(screen.getByTestId("error-message")).toBeInTheDocument());
  });
});