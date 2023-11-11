import "./App.css";
import { useEffect, useState, useRef } from "react";
import { FiTrash, FiEdit2 } from "react-icons/fi";
import * as Dialog from "@radix-ui/react-dialog";
import { api } from "./services/api";
import { Cross2Icon } from "@radix-ui/react-icons";

function App() {
  const [funcionarios, setFuncionarios] = useState([]);
  const nameRef = useRef(null);
  const cargoRef = useRef(null);
  const salarioRef = useRef(null);

  const [att, setAtt] = useState({});

  const nameRefAtt = useRef(null);
  const cargoRefAtt = useRef(null);
  const salarioRefAtt = useRef(null);

  const [radio, setRadio] = useState(true);
  const [radioAtt, setRadioAtt] = useState(true);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    loadFuncionarios();
  }, [funcionarios]);

  async function loadFuncionarios() {
    const response = await api.get("/funcionario");
    setFuncionarios(response.data);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (
      !nameRef.current?.value ||
      !cargoRef.current?.value ||
      !salarioRef.current?.value
    )
      return;

    const response = await api.post("/funcionario", {
      nome: nameRef.current?.value,
      cargo: cargoRef.current?.value,
      salario: salarioRef.current?.value,
      contratado: radio,
    });

    alert(response.data.message);

    nameRef.current.value = "";
    cargoRef.current.value = "";
    salarioRef.current.value = "";
    setRadio(null);
  }

  async function handleDelete(id) {
    try {
      const response = await api.delete(`/funcionario/${id}`);
      alert(response.data.message);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleEdit(func) {
    if (
      !nameRefAtt.current?.value ||
      !cargoRefAtt.current?.value ||
      !salarioRefAtt.current?.value
    )
      return;

    try {
      const response = await api.put(`/funcionario/${func._id}`, {
        nome: nameRefAtt.current?.value,
        cargo: cargoRefAtt.current?.value,
        salario: salarioRefAtt.current?.value,
        contratado: radio,
      });

      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
    await api.put(`/funcionario/${func._id}`, {
      nome: nameRefAtt.current?.value,
      cargo: cargoRefAtt.current?.value,
      salario: salarioRefAtt.current?.value,
      contratado: radioAtt,
    });

    nameRefAtt.current.value = func.nome;
    cargoRefAtt.current.value = func.cargo;
    salarioRefAtt.current.value = func.salario;

    alert(`Dados do funcionário ${func.nome} atualizados com sucesso!`);

    setModal(false);
  }

  return (
    <div className="w-full min-h-screen bg-gray-900 flex justify-center px-4">
      <main className="w-full my-10 md:max-w-2xl">
        <h1 className="text-4xl font-medium text-yellow-500"> Funcionários</h1>

        <form className="flex flex-col my-6" onSubmit={handleSubmit}>
          <label className="font-medium text-white">Nome: </label>
          <input
            required
            type="text"
            placeholder="Digite o nome do funcionário"
            className="w-full mb-5 p-2 rounded"
            ref={nameRef}
          />

          <label className="font-medium text-white">Cargo: </label>
          <input
            required
            type="text"
            placeholder="Digite o cargo do funcionário"
            className="w-full mb-5 p-2 rounded"
            ref={cargoRef}
          />

          <label className="font-medium text-white">Salário: </label>
          <input
            required
            type="number"
            placeholder="Digite o salário do funcionário"
            className="w-full mb-5 p-2 rounded"
            ref={salarioRef}
          />

          <label className="font-medium text-white">Contratado: </label>
          <div className="flex w-full text-white items-center gap-10 uppercase my-5">
            <div className="flex gap-2">
              <input
                className="hidden peer"
                onClick={(e) => setRadio(e.target.value)}
                type="radio"
                name="contratado"
                id="true"
                value={true}
              />
              <label
                className="inline-flex items-center justify-center w-24 p-2 text-white bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                htmlFor="true"
              >
                sim
              </label>
            </div>
            <div className="flex gap-2">
              <input
                className="hidden peer"
                onClick={(e) => setRadio(e.target.value)}
                type="radio"
                name="contratado"
                id="false"
                value={false}
              />
              <label
                className="inline-flex items-center justify-center w-24 p-2 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                htmlFor="false"
              >
                não
              </label>
            </div>
          </div>

          <input
            type="submit"
            value="Cadastrar"
            className="cursor-pointer w-full p-2 bg-green-500 rounded font-medium hover:text-white hover:bg-green-700 hover:scale-105 duration-100"
          />
        </form>

        <section className="flex flex-col gap-4">
          {funcionarios.length === 0 ? (
            <p className="text-white font-medium  text-lg my-3 self-center">
              Não há nenhum funcionário cadastrado...{" "}
            </p>
          ) : (
            funcionarios.map((func) => (
              <article
                className="w-full bg-white rounded p-2 relative hover:scale-105 duration-200"
                key={func._id}
              >
                <Dialog.Root onOpenChange={setModal} open={modal}>
                  <Dialog.Portal>
                    <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
                    <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                      <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
                        Editar funcionário
                      </Dialog.Title>
                      <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
                        Atualize os dados do funcionário.
                      </Dialog.Description>
                      <fieldset className="mb-[15px] flex items-center gap-5">
                        <label
                          className="text-violet11 w-[90px] text-right text-[15px]"
                          htmlFor="name"
                        >
                          Nome
                        </label>
                        <input
                          className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                          id="nome"
                          ref={nameRefAtt}
                          defaultValue={att.nome}
                        />
                      </fieldset>
                      <fieldset className="mb-[15px] flex items-center gap-5">
                        <label
                          className="text-violet11 w-[90px] text-right text-[15px]"
                          htmlFor="username"
                        >
                          Cargo
                        </label>
                        <input
                          className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                          id="cargo"
                          ref={cargoRefAtt}
                          defaultValue={att.cargo}
                        />
                      </fieldset>
                      <fieldset className="mb-[15px] flex items-center gap-5">
                        <label
                          className="text-violet11 w-[90px] text-right text-[15px]"
                          htmlFor="username"
                        >
                          Salário
                        </label>
                        <input
                          className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                          id="salario"
                          ref={salarioRefAtt}
                          defaultValue={att.salario}
                        />
                      </fieldset>
                      <fieldset className="mb-[15px] flex items-center gap-5">
                        <label
                          className="text-violet11 w-[90px] text-right text-[15px]"
                          htmlFor="username"
                        >
                          Contratado
                        </label>
                        {att.contratado ? (
                          <div className="flex">
                            <div className="flex items-center mr-4 justify-center w-24 p-2 text-black bg-white border border-black rounded-lg cursor-pointer">
                              <input
                                id="inline-radio"
                                type="radio"
                                value={true}
                                onClick={(e) => setRadioAtt(e.target.value)}
                                defaultChecked
                                name="inline-radio-group"
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 "
                              />
                              <label
                                htmlFor="inline-radio"
                                className="ml-2 text-sm font-medium text-black"
                              >
                                Ativo
                              </label>
                            </div>
                            <div className="flex items-center mr-4 justify-center w-24 p-2 text-black bg-white border border-black rounded-lg cursor-pointer">
                              <input
                                id="inline-radio"
                                type="radio"
                                value={false}
                                name="inline-radio-group"
                                onClick={(e) => setRadioAtt(e.target.value)}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 "
                              />
                              <label
                                htmlFor="inline-radio"
                                className="ml-2 text-sm font-medium text-black"
                              >
                                Inativo
                              </label>
                            </div>
                          </div>
                        ) : (
                          <div className="flex">
                            <div className="flex items-center mr-4 justify-center w-24 p-2 text-black bg-white border border-black rounded-lg cursor-pointer">
                              <input
                                id="inline-radio"
                                type="radio"
                                value={true}
                                onClick={(e) => setRadioAtt(e.target.value)}
                                name="inline-radio-group"
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 "
                              />
                              <label
                                htmlFor="inline-radio"
                                className="ml-2 text-sm font-medium text-black"
                              >
                                Ativo
                              </label>
                            </div>
                            <div className="flex items-center mr-4 justify-center w-24 p-2 text-black bg-white border border-black rounded-lg cursor-pointer">
                              <input
                                id="inline-radio"
                                type="radio"
                                value={false}
                                name="inline-radio-group"
                                onClick={(e) => setRadioAtt(e.target.value)}
                                defaultChecked
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 "
                              />
                              <label
                                htmlFor="inline-radio"
                                className="ml-2 text-sm font-medium text-black"
                              >
                                Inativo
                              </label>
                            </div>
                          </div>
                        )}
                      </fieldset>
                      <div className="mt-[25px] flex justify-end">
                        <button
                          onClick={() => handleEdit(att)}
                          className="bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
                        >
                          Atualizar
                        </button>
                      </div>
                      <Dialog.Close asChild>
                        <button
                          className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                          aria-label="Close"
                        >
                          <Cross2Icon />
                        </button>
                      </Dialog.Close>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>
                <p>
                  <span className="font-medium">Nome: </span>
                  {func.nome}
                </p>
                <p>
                  <span className="font-medium">Cargo: </span>
                  {func.cargo}
                </p>
                <p>
                  <span className="font-medium">Salário: </span>
                  {func.salario}
                </p>
                <p>
                  <span className="font-medium">Status: </span>
                  {func.contratado ? "ATIVO" : "INATIVO"}
                </p>

                <button
                  onClick={() => handleDelete(func._id)}
                  className="bg-red-500 w-7 h-7 flex items-center justify-center rounded-lg  absolute right-0 -top-2"
                >
                  <FiTrash size={18} color="#FFF" />
                </button>

                <button
                  onClick={() => {
                    setAtt({
                      _id: func._id,
                      nome: func.nome,
                      cargo: func.cargo,
                      salario: func.salario,
                      contratado: func.contratado,
                    });
                    setModal(true);
                  }}
                  className="bg-blue-500 w-7 h-7 flex items-center justify-center rounded-lg  absolute right-8 -top-2"
                >
                  <FiEdit2 size={18} color="#FFF" />
                </button>
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
