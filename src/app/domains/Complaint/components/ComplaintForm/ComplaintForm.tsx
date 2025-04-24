import React, { ChangeEvent, useRef, useState } from "react";

import ComplaintFieldSelect from "./components/ComplaintFieldSelect";
import Loading from "../../../../components/Loading";
import getApiUrl from "../../../../utils/getApiUrl";
import useWidgetContext from "../../../../contexts/Widget/useWidgetContext";

const COMPLAINTS_REASONS = [
  { name: "Klipp", objectId: "klipp" },
  { name: "Striper", objectId: "striper" },
  { name: "Farge", objectId: "farge" },
  { name: "Kundeopplevelsen", objectId: "kundeopplevelsen" },
  { name: "Annet", objectId: "annet" },
];

const ComplaintForm: React.FC = () => {
  const { salons, employees, env } = useWidgetContext();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSalon, setSelectedSalon] = useState({
    value: salons?.[0]?.objectId || '',
    isDirty: true,
  });
  const [selectedEmployee, setSelectedEmployee] = useState({
    value: "",
    isDirty: true,
  });
  const [selectedReason, setSelectedReason] = useState({
    value: COMPLAINTS_REASONS[0].objectId,
    isDirty: true,
  });
  const [nameInputValidation, setNameInputValidation] = useState({
    isDirty: true,
  });
  const [emailInputValidation, setEmailInputValidation] = useState({
    isDirty: true,
    isValid: true,
  });
  const [phoneInputValidation, setPhoneInputValidation] = useState({
    isDirty: true,
    isValid: true,
  });
  const [dateInputValidation, setDateInputValidation] = useState({
    isDirty: true,
  });
  const [commentInputValidation, setCommentInputValidation] = useState({
    isDirty: true,
  });

  const onNameInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value && nameInputValidation.isDirty)
      return setNameInputValidation({ isDirty: false });
    if (e.target.value && !nameInputValidation.isDirty)
      return setNameInputValidation({ isDirty: true });
  };

  const onDateInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value && dateInputValidation.isDirty)
      return setDateInputValidation({ isDirty: false });
    if (e.target.value && !dateInputValidation.isDirty)
      return setDateInputValidation({ isDirty: true });
  };

  const onEmailInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value && emailInputValidation.isDirty)
      return setEmailInputValidation((prev) => ({ ...prev, isDirty: false }));
    if (e.target.value && !emailInputValidation.isDirty)
      return setEmailInputValidation({
        isValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value),
        isDirty: true,
      });
    return setEmailInputValidation((prev) => ({
      ...prev,
      isValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value),
    }));
  };

  const onPhoneInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value && phoneInputValidation.isDirty)
      return setPhoneInputValidation((prev) => ({ ...prev, isDirty: false }));
    if (e.target.value && !phoneInputValidation.isDirty)
      return setPhoneInputValidation({
        isValid:
          /^\+47\s?\d{8}$|^(\d{3}\s?\d{2}\s?\d{3}|\d{2}\s?\d{2}\s?\d{2}\s?\d{2})$/.test(
            e.target.value
          ),
        isDirty: true,
      });
    return setPhoneInputValidation((prev) => ({
      ...prev,
      isValid:
        /^\+47\s?\d{8}$|^(\d{3}\s?\d{2}\s?\d{3}|\d{2}\s?\d{2}\s?\d{2}\s?\d{2})$/.test(
          e.target.value
        ),
    }));
  };

  const onCommentInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (!e.target.value && commentInputValidation.isDirty)
      return setCommentInputValidation({ isDirty: false });
    if (e.target.value && !commentInputValidation.isDirty)
      return setCommentInputValidation({ isDirty: true });
  };

  const onSubmitForm = async () => {
    if (!nameInputRef.current?.value) {
      setNameInputValidation({ isDirty: false });
      setPhoneInputValidation({
        isDirty: !!phoneInputRef.current?.value,
        isValid: phoneInputRef.current?.value
          ? /^\+47\s?\d{8}$|^(\d{3}\s?\d{2}\s?\d{3}|\d{2}\s?\d{2}\s?\d{2}\s?\d{2})$/.test(
              phoneInputRef.current?.value
            )
          : false,
      });
      setDateInputValidation({ isDirty: !!dateInputRef.current?.value });
      setCommentInputValidation({ isDirty: !!commentInputRef.current?.value });
      setSelectedSalon((prev) => ({ ...prev, isDirty: !!prev.value }));
      setSelectedReason((prev) => ({ ...prev, isDirty: !!prev.value }));
      setSelectedEmployee((prev) => ({ ...prev, isDirty: !!prev.value }));
      return setEmailInputValidation({
        isDirty: !!emailInputRef.current?.value,
        isValid: emailInputRef.current?.value
          ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInputRef.current?.value)
          : false,
      });
    }
    if (
      !emailInputRef.current?.value ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInputRef.current?.value)
    ) {
      setPhoneInputValidation({
        isDirty: !!phoneInputRef.current?.value,
        isValid: phoneInputRef.current?.value
          ? /^\+47\s?\d{8}$|^(\d{3}\s?\d{2}\s?\d{3}|\d{2}\s?\d{2}\s?\d{2}\s?\d{2})$/.test(
              phoneInputRef.current?.value
            )
          : false,
      });
      setDateInputValidation({ isDirty: !!dateInputRef.current?.value });
      setCommentInputValidation({ isDirty: !!commentInputRef.current?.value });
      setSelectedSalon((prev) => ({ ...prev, isDirty: !!prev.value }));
      setSelectedReason((prev) => ({ ...prev, isDirty: !!prev.value }));
      setSelectedEmployee((prev) => ({ ...prev, isDirty: !!prev.value }));
      return setEmailInputValidation({
        isDirty: !!emailInputRef.current?.value,
        isValid: emailInputRef.current?.value
          ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInputRef.current?.value)
          : false,
      });
    }
    if (
      !phoneInputRef.current?.value ||
      !/^\+47\s?\d{8}$|^(\d{3}\s?\d{2}\s?\d{3}|\d{2}\s?\d{2}\s?\d{2}\s?\d{2})$/.test(
        phoneInputRef.current?.value
      )
    ) {
      setPhoneInputValidation({
        isDirty: !!phoneInputRef.current?.value,
        isValid: phoneInputRef.current?.value
          ? /^\+47\s?\d{8}$|^(\d{3}\s?\d{2}\s?\d{3}|\d{2}\s?\d{2}\s?\d{2}\s?\d{2})$/.test(
              phoneInputRef.current?.value
            )
          : false,
      });
      setDateInputValidation({ isDirty: !!dateInputRef.current?.value });
      setCommentInputValidation({ isDirty: !!commentInputRef.current?.value });
      setSelectedSalon((prev) => ({ ...prev, isDirty: !!prev.value }));
      setSelectedReason((prev) => ({ ...prev, isDirty: !!prev.value }));
      return setSelectedEmployee((prev) => ({
        ...prev,
        isDirty: !!prev.value,
      }));
    }
    if(!dateInputRef.current?.value){
        setDateInputValidation({ isDirty: false});
        setCommentInputValidation({ isDirty: !!commentInputRef.current?.value });
        setSelectedSalon((prev) => ({ ...prev, isDirty: !!prev.value }));
        setSelectedReason((prev) => ({ ...prev, isDirty: !!prev.value }));
        return setSelectedEmployee((prev) => ({
          ...prev,
          isDirty: !!prev.value,
        }));
    }
    if(!commentInputRef.current?.value){
        setCommentInputValidation({ isDirty: false });
        setSelectedSalon((prev) => ({ ...prev, isDirty: !!prev.value }));
        setSelectedReason((prev) => ({ ...prev, isDirty: !!prev.value }));
        return setSelectedEmployee((prev) => ({
          ...prev,
          isDirty: !!prev.value,
        }));
    }
    if(!selectedSalon){
        setSelectedSalon((prev) => ({ ...prev, isDirty: !!prev.value }));
        setSelectedReason((prev) => ({ ...prev, isDirty: !!prev.value }));
        return setSelectedEmployee((prev) => ({
          ...prev,
          isDirty: !!prev.value,
        }));
    }
    if(!selectedReason){
        setSelectedReason((prev) => ({ ...prev, isDirty: !!prev.value }));
        return setSelectedEmployee((prev) => ({
          ...prev,
          isDirty: !!prev.value,
        }));
    }
    if(!selectedEmployee)
        return setSelectedEmployee((prev) => ({
          ...prev,
          isDirty: !!prev.value,
        }));
        try {
            setIsSubmitting(true);
            await fetch(`${getApiUrl(env)}/chains/complaint`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: emailInputRef.current?.value,
                name: nameInputRef.current?.value,
                backdate: dateInputRef.current?.value,
                employee: selectedEmployee.value,
                message: commentInputRef.current?.value,
                phone: phoneInputRef.current?.value,
                salon: selectedSalon.value,
                type: selectedReason.value
              }),
            });
            alert('Denne saken er registrert i vårt system')
          } catch (error) {
            alert(`Det oppstod en feil under registrering av sak: ${(error as Error).message}`);
            console.log("Error:", error);
          } finally {
            setIsSubmitting(false);
          }
  };

  return (
    <>
      <div style={{ marginBottom: "24px" }}>
        <div className="input-label">Navn:</div>
        <input
          ref={nameInputRef}
          onChange={onNameInputChange}
          type="text"
          className={`input${
            !nameInputValidation.isDirty ? " input-error" : ""
          }`}
          placeholder="Skriv inn navnet ditt"
        />
        {!nameInputValidation.isDirty ? (
          <div className="text-error">
            Vennligst skriv inn navn for bestilling
          </div>
        ) : null}
      </div>

      <div style={{ marginBottom: "24px" }}>
        <div className="input-label">E-post:</div>
        <input
          ref={emailInputRef}
          onChange={onEmailInputChange}
          type="email"
          className={`input${
            !nameInputValidation.isDirty || !emailInputValidation.isValid
              ? " input-error"
              : ""
          }`}
          placeholder="Skriv inn e-postadressen din"
        />
        {!emailInputValidation.isDirty || !emailInputValidation.isValid ? (
          <div className="text-error">
            {!emailInputValidation.isDirty
              ? "Vennligst skriv inn navn for bestilling"
              : "E-posten er ugyldig"}
          </div>
        ) : null}
      </div>

      <div style={{ marginBottom: "24px" }}>
        <div className="input-label">Telefonnummer:</div>
        <input
          ref={phoneInputRef}
          onChange={onPhoneInputChange}
          type="tel"
          className={`input${
            !phoneInputValidation.isDirty || !phoneInputValidation.isValid
              ? " input-error"
              : ""
          }`}
          placeholder="Skriv inn telefonnummer din"
        />
        {!phoneInputValidation.isDirty || !phoneInputValidation.isValid ? (
          <div className="text-error">
            {!phoneInputValidation.isDirty
              ? "Vennligst skriv inn telefonnummer"
              : "Telefonnummer er ugyldig"}
          </div>
        ) : null}
      </div>

      <div style={{ marginBottom: "24px" }}>
        <div className="input-label">Dato du var hos oss:</div>
        <input
          ref={dateInputRef}
          onChange={onDateInputChange}
          type="date"
          className={`input${
            !dateInputValidation.isDirty ? " input-error" : ""
          }`}
          placeholder="Skriv inn dato du var hos oss"
        />
        {!dateInputValidation.isDirty ? (
          <div className="text-error">Dato er ugyldig</div>
        ) : null}
      </div>

      <div style={{ marginBottom: "24px" }}>
        <div className="input-label">Hvilken avdeling besøkte du?</div>
        <ComplaintFieldSelect
          items={salons!}
          selectedItem={selectedSalon.value}
          setSelectedItem={(value) =>
            setSelectedSalon({ value, isDirty: true })
          }
        />
        {!selectedSalon.isDirty ? (
          <div className="text-error">Velg salong</div>
        ) : null}
      </div>

      <div style={{ marginBottom: "24px" }}>
        <div className="input-label">Hvilken frisør var du hos?</div>
        <ComplaintFieldSelect
          items={employees?.[selectedSalon.value!]!}
          selectedItem={selectedEmployee.value}
          setSelectedItem={(value) =>
            setSelectedEmployee({ value, isDirty: true })
          }
        />
        {!selectedEmployee.isDirty ? (
          <div className="text-error">Velg frisør</div>
        ) : null}
      </div>

      <div style={{ marginBottom: "24px" }}>
        <div className="input-label">Hva er du ikke fornøyd med?</div>
        <ComplaintFieldSelect
          items={COMPLAINTS_REASONS}
          selectedItem={selectedReason.value}
          setSelectedItem={(value) =>
            setSelectedReason({ value, isDirty: true })
          }
        />
        {!selectedReason.isDirty ? (
          <div className="text-error">Vennligst velg ett alternativ</div>
        ) : null}
      </div>

      <div style={{ marginBottom: "24px" }}>
        <div className="input-label">Dato du var hos oss:</div>
        <textarea
          ref={commentInputRef}
          onChange={onCommentInputChange}
          className={`input${
            !dateInputValidation.isDirty ? " input-error" : ""
          }`}
          placeholder="Skriv inn dato du var hos oss"
        />
        {!dateInputValidation.isDirty ? (
          <div className="text-error">Dato er ugyldig</div>
        ) : null}
      </div>

      <button
      style={{width: '100%'}}
        disabled={isSubmitting}
        id="saveButton"
        onClick={onSubmitForm}
        className="save-button"
      >
        <div style={{ display: "flex", gap: "4px", alignItems: "center", justifyContent: 'center' }}>
          {isSubmitting ? (
            <Loading
              spinnerColor="var(--bg-default)"
              backgroundColor="transparent"
              containerHeight={20}
              spinnerSize={10}
            />
          ) : null}
          <div>Send inn skjema</div>
        </div>
      </button>
    </>
  );
};

export default ComplaintForm;
