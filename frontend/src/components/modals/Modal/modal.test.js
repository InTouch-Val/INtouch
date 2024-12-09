import React from "react";
import { render } from "@testing-library/react";
import Modal from "./Modal";

describe("Modal", () => {
  it("renders and contains the modal element", () => {
    const modalRoot = document.createElement("div");
    modalRoot.setAttribute("id", "modal-root");
    document.body.appendChild(modalRoot);

    const { getById } = render(<Modal>Test Content</Modal>);

    // Проверяем, что элемент с id="modal" существует
    const modalElement = document.getElementById("modal");
    expect(modalElement).toBeInTheDocument(); // Проверяем, что элемент рендерится

    // Также можно проверить содержимое модального окна
    expect(modalElement).toHaveTextContent("Test Content");
  });
});
