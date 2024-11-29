import React, { useState } from 'react';


const InputGroup = ({
  label,
  id,
  type,
  value,
  onChange,
  required,
  min,
  max,
  step,
  helper,
  children,
  checkDuplicate,
}) => (
  <div className="mb-6">
    <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2">
      {label}
    </label>
    <div className="flex gap-2">
      <div className="flex-1">
        {children || (
          <input
            type={type === 'check' ? 'text' : type} // Adjust type if necessary
            id={id}
            value={value}
            onChange={onChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required={required}
            min={min}
            max={max}
            step={step}
          />
        )}
      </div>
      {type === 'check' && checkDuplicate && (
        <button
          type="button"
          onClick={() => checkDuplicate(id === 'uid' ? 'username' : 'displayName')}
          className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors min-w-[120px]"
        >
          확인
        </button>
      )}
    </div>
    {helper && <p className="mt-2 text-sm text-gray-500">{helper}</p>}
  </div>
);

export function CreateUserModal({ selectedUserId, isOpen, onClose }) {
  const [uid, setUid] = useState('');
  const [nic, setNic] = useState('');
  const [password, setPassword] = useState('');
  const [mmSlot, setMmSlot] = useState('');
  const [mmLive, setMmLive] = useState('');
  const [bankInfo, setBankInfo] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [bankOwner, setBankOwner] = useState('');
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [isDisplayNameValid, setIsDisplayNameValid] = useState(false);
  

  const checkDuplicate = (type) => {
    let value = type === 'username' ? uid : nic;
    if (value.length < 2) {
      alert(`유효한 ${type === 'username' ? '아이디' : '닉네임'}를 입력해주세요.`);
      return;
    }

    fetch(`/api/validation/${type}?value=${encodeURIComponent(value)}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.exists) {
          alert(`이미 사용중인 ${type === 'username' ? '아이디' : '닉네임'}입니다. 다른 것을 선택해주세요.`);
          type === 'username' ? setIsUsernameValid(false) : setIsDisplayNameValid(false);
        } else {
          alert(`사용 가능한 ${type === 'username' ? '아이디' : '닉네임'}입니다!`);
          type === 'username' ? setIsUsernameValid(true) : setIsDisplayNameValid(true);
        }
      })
      .catch((error) => console.error('Error:', error));
  };

  const isFormValid = () => {
    return isUsernameValid && isDisplayNameValid && password.length >= 6 && bankOwner.length > 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      const formData = {
        uid, nic, password, mm_slot: mmSlot, mm_live: mmLive,
        bankinfo: bankInfo, bankcode: bankCode, bankowner: bankOwner,selectedUserId:selectedUserId
      };

      fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (response.ok) {
            alert('회원가입이 완료되었습니다');
            onClose();
          } else {
            alert('회원가입 중 오류가 발생했습니다');
          }
        })
        .catch((error) => console.error('Error:', error));
    } else {
      alert('Please fill out the form correctly');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">회원가입</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup
              label="아이디"
              id="uid"
              type="check"
              value={uid}
              onChange={(e) => {
                setUid(e.target.value);
                setIsUsernameValid(false);
              }}
              required
              helper="고유 식별자를 입력하세요 (2-20자)"
              checkDuplicate={checkDuplicate} // Add this line
            />

            <InputGroup
              label="닉네임"
              id="nic"
              type="check"
              value={nic}
              onChange={(e) => {
            setNic(e.target.value);
            setIsDisplayNameValid(false);
          }}
          required
          helper="닉네임을 선택하세요 (2-8자)"
          checkDuplicate={checkDuplicate} // Add this line
        />
          </div>

          <InputGroup
            label="비밀번호"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            helper="최소 6자 이상 입력하세요"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputGroup
              label="슬롯 수수료"
              id="mm_slot"
              type="number"
              value={mmSlot}
              onChange={(e) => setMmSlot(e.target.value)}
              min="0"
              max="4.30"
              step="0.01"
              helper="범위: 0% - 4.30%"
            />

            <InputGroup
              label="홀덤 수수료"
              id="mm_live"
              type="number"
              value={mmLive}
              onChange={(e) => setMmLive(e.target.value)}
              min="0"
              max="1.10"
              step="0.01"
              helper="범위: 0% - 1.10%"
            />
          </div>

          <InputGroup
            label="은행"
            id="bankinfo"
            value={bankInfo}
            onChange={(e) => setBankInfo(e.target.value)}
          >
            <select
              value={bankInfo}
              onChange={(e) => setBankInfo(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">은행을 선택하세요</option>
              <option value="경남은행">경남은행</option>
              <option value="기업은행">기업은행</option>
              <option value="광주은행">광주은행</option>
              <option value="국민은행">국민은행</option>
              <option value="농협중앙회">농협중앙회</option>
              <option value="농협(지역)">농협(지역)</option>
              <option value="대구은행">대구은행</option>
              <option value="부산은행">부산은행</option>
              <option value="산업은행">산업은행</option>
              <option value="새마을금고">새마을금고</option>
              <option value="신한은행">신한은행</option>
              <option value="신협중앙회">신협중앙회</option>
              <option value="수출입은행">수출입은행</option>
              <option value="수협중앙회">수협중앙회</option>
              <option value="외환은행">외환은행</option>
              <option value="우리은행">우리은행</option>
              <option value="우체국">우체국</option>
              <option value="전북은행">전북은행</option>
              <option value="제주은행">제주은행</option>
              <option value="하나은행">하나은행</option>
              <option value="한국씨티은행">한국씨티은행</option>
              <option value="HSBC은행">HSBC은행</option>
              <option value="sc제일은행">sc제일은행</option>
              <option value="카카오뱅크">카카오뱅크</option>
              <option value="케이뱅크">케이뱅크</option>
              <option value="토스">토스</option>
            </select>
          </InputGroup>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputGroup
              label="계좌번호"
              id="bankcode"
              type="text"
              value={bankCode}
              onChange={(e) => setBankCode(e.target.value)}
              required
            />

            <InputGroup
              label="예금주"
              id="bankowner"
              type="text"
              value={bankOwner}
              onChange={(e) => setBankOwner(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!isFormValid()}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              계정 생성
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}