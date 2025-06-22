import React, { useState, useEffect } from 'react';
import './App.css';

// 아이콘 컴포넌트 (간단 버전)
const Icon = ({ className = "h-5 w-5", children }) => (
  <div className={`inline-flex items-center justify-center ${className}`}>
    {children}
  </div>
);

const DormitoryManagement = () => {
  const [currentView, setCurrentView] = useState('report');
  const [selectedManager, setSelectedManager] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');
  const [students, setStudents] = useState([]);
  const [summary, setSummary] = useState({
    current: 0, overnight: 0, checkout: 0, newStudent: 0, moveOut: 0, moveIn: 0, etc: 0
  });

  // 기숙사 구조 정의
  const buildings = [
    { code: 'A', name: 'A동', gender: 'male', color: 'from-blue-500 to-blue-600' },
    { code: 'B', name: 'B동', gender: 'male', color: 'from-cyan-500 to-cyan-600' },
    { code: 'C', name: 'C동', gender: 'male', color: 'from-indigo-500 to-indigo-600' },
    { code: 'D', name: 'D동', gender: 'female', color: 'from-pink-500 to-pink-600' },
    { code: 'E', name: 'E동', gender: 'female', color: 'from-rose-500 to-rose-600' },
    { code: 'F', name: 'F동', gender: 'male', color: 'from-purple-500 to-purple-600' }
  ];
  
  const floors = [1, 2, 3, 4];
  const managers = Array.from({length: 23}, (_, i) => `담당자${i + 1}`);
  const statusOptions = [
    { value: '정상', label: '정상' }, { value: '외박', label: '외박' },
    { value: '퇴소', label: '퇴소' }, { value: '신규', label: '신규' },
    { value: '등미', label: '등미' }, { value: '-이동', label: '-이동' },
    { value: '+이동', label: '+이동' }, { value: '기타', label: '기타' }
  ];

  // Mock 데이터 생성
  const generateMockStudents = (building, floor) => {
    const names = building === 'D' || building === 'E' 
      ? ['이영희', '박지수', '정수진', '한지민']
      : ['김철수', '이민호', '박준영', '정우성'];
    
    return Array.from({length: 20}, (_, i) => ({
      room: `${building}${floor}0${i + 1}`,
      name: Math.random() > 0.2 ? names[i % names.length] : '미배정',
      status: Math.random() > 0.8 ? statusOptions[Math.floor(Math.random() * statusOptions.length)].value : '정상',
      memo: ''
    }));
  };

  useEffect(() => {
    if (selectedBuilding && selectedFloor) {
      const mockData = generateMockStudents(selectedBuilding, parseInt(selectedFloor));
      setStudents(mockData);
    }
  }, [selectedBuilding, selectedFloor]);

  useEffect(() => {
    setSummary({
      current: students.filter(s => s.status === '정상').length,
      overnight: students.filter(s => s.status === '외박').length,
      checkout: students.filter(s => s.status === '퇴소').length,
      newStudent: students.filter(s => s.status === '신규').length,
      moveOut: students.filter(s => s.status === '-이동').length,
      moveIn: students.filter(s => s.status === '+이동').length,
      etc: students.filter(s => s.status === '기타').length
    });
  }, [students]);

  const updateStudentStatus = (roomNumber, newStatus) => {
    setStudents(prev => prev.map(student => 
      student.room === roomNumber ? { ...student, status: newStatus } : student
    ));
  };

  const getCurrentBuildingInfo = () => buildings.find(b => b.code === selectedBuilding);
  const currentBuildingInfo = getCurrentBuildingInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* 네비게이션 */}
      <nav className="bg-white shadow-lg border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="text-3xl">🏠</div>
              <div>
                <h1 className="text-2xl font-bold text-blue-600">기숙사 관리 시스템</h1>
                <p className="text-sm text-gray-500">Smart Dormitory Management</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentView('report')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  currentView === 'report'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-blue-50'
                }`}
              >
                📝 인원보고
              </button>
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  currentView === 'dashboard'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-blue-50'
                }`}
              >
                📊 대시보드
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {currentView === 'report' ? (
          <div className="space-y-8">
            {/* 선택 영역 */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">📝 인원 보고</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">담당자</label>
                  <select
                    value={selectedManager}
                    onChange={(e) => setSelectedManager(e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    <option value="">담당자를 선택하세요</option>
                    {managers.map(manager => (
                      <option key={manager} value={manager}>{manager}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">동</label>
                  <select
                    value={selectedBuilding}
                    onChange={(e) => setSelectedBuilding(e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    <option value="">동을 선택하세요</option>
                    {buildings.map(building => (
                      <option key={building.code} value={building.code}>
                        {building.name} ({building.gender === 'male' ? '남학생' : '여학생'})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">층</label>
                  <select
                    value={selectedFloor}
                    onChange={(e) => setSelectedFloor(e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    <option value="">층을 선택하세요</option>
                    {floors.map(floor => (
                      <option key={floor} value={floor}>
                        {floor}층 {floor === 4 ? '(3인실)' : '(1인실)'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {currentBuildingInfo && (
                <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{currentBuildingInfo.gender === 'male' ? '🛡️' : '✨'}</div>
                    <div>
                      <h3 className="font-bold text-gray-900">{currentBuildingInfo.name}</h3>
                      <p className="text-sm text-gray-600">
                        {currentBuildingInfo.gender === 'male' ? '남학생 기숙사' : '여학생 기숙사'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {selectedBuilding && selectedFloor && (
              <>
                {/* 집계 현황 */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    📊 {selectedBuilding}동 {selectedFloor}층 현황
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {[
                      { key: 'current', label: '현재원', emoji: '✅', color: 'bg-green-500' },
                      { key: 'overnight', label: '외박', emoji: '🌙', color: 'bg-blue-500' },
                      { key: 'checkout', label: '퇴소', emoji: '❌', color: 'bg-red-500' },
                      { key: 'newStudent', label: '신규', emoji: '🆕', color: 'bg-purple-500' },
                      { key: 'moveOut', label: '-이동', emoji: '⬅️', color: 'bg-orange-500' },
                      { key: 'moveIn', label: '+이동', emoji: '➡️', color: 'bg-indigo-500' },
                      { key: 'etc', label: '기타', emoji: '⚡', color: 'bg-gray-500' }
                    ].map(({ key, label, emoji, color }) => (
                      <div key={key} className="text-center">
                        <div className={`${color} text-white rounded-2xl p-4 mb-2`}>
                          <div className="text-2xl mb-2">{emoji}</div>
                          <div className="text-xl font-bold">{summary[key]}</div>
                        </div>
                        <div className="text-sm font-bold text-gray-700">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 학생 목록 */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">👥 학생 목록</h3>
                  
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {students.slice(0, 10).map((student, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-500 text-white rounded-xl flex items-center justify-center font-bold text-sm">
                            {student.room}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{student.name}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <select
                            value={student.status}
                            onChange={(e) => updateStudentStatus(student.room, e.target.value)}
                            className="p-2 border border-gray-300 rounded-lg text-sm"
                            disabled={student.name === '미배정'}
                          >
                            {statusOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          
                          <div className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                            {student.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 제출 버튼 */}
                <div className="flex justify-center">
                  <button
                    onClick={() => alert('✅ 인원보고가 제출되었습니다!')}
                    className="px-8 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all transform hover:scale-105 shadow-xl font-bold text-lg"
                  >
                    📤 인원보고 제출
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {/* 대시보드 */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">📊 전체 현황 대시보드</h2>

              {/* 전체 집계 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { title: '총 현재원', count: 850, emoji: '👥', color: 'bg-green-500' },
                  { title: '외박', count: 45, emoji: '🌙', color: 'bg-blue-500' },
                  { title: '신규', count: 12, emoji: '🆕', color: 'bg-purple-500' },
                  { title: '퇴소', count: 8, emoji: '❌', color: 'bg-red-500' }
                ].map((item, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all transform hover:scale-105">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{item.title}</p>
                        <p className="text-3xl font-bold text-gray-900">{item.count}</p>
                      </div>
                      <div className={`${item.color} p-4 rounded-2xl text-2xl`}>
                        {item.emoji}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 성별 통계 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">🛡️</div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">남학생 현황</h3>
                        <p className="text-gray-600">A, B, C, F동</p>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-blue-600">520</div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-white rounded-xl">
                      <div className="text-lg font-bold text-green-600">442</div>
                      <div className="text-xs text-gray-600">현재원</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-xl">
                      <div className="text-lg font-bold text-blue-600">32</div>
                      <div className="text-xs text-gray-600">외박</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-xl">
                      <div className="text-lg font-bold text-orange-600">46</div>
                      <div className="text-xs text-gray-600">기타</div>
                    </div>
                  </div>
                </div>

                <div className="bg-pink-50 rounded-2xl p-6 border border-pink-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">✨</div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">여학생 현황</h3>
                        <p className="text-gray-600">D, E동</p>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-pink-600">330</div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-white rounded-xl">
                      <div className="text-lg font-bold text-green-600">298</div>
                      <div className="text-xs text-gray-600">현재원</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-xl">
                      <div className="text-lg font-bold text-blue-600">13</div>
                      <div className="text-xs text-gray-600">외박</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-xl">
                      <div className="text-lg font-bold text-orange-600">19</div>
                      <div className="text-xs text-gray-600">기타</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 동별 현황 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">🏢 동별 현황</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {buildings.map(building => (
                    <div key={building.code} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all transform hover:scale-105">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">
                            {building.gender === 'male' ? '🛡️' : '✨'}
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-gray-900">{building.name}</h4>
                            <p className="text-sm text-gray-600">
                              {building.gender === 'male' ? '남학생' : '여학생'}
                            </p>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                          {Math.floor(Math.random() * 200) + 100}
                        </div>
                      </div>
                      <div className="space-y-3">
                        {floors.map(floor => (
                          <div key={floor} className="flex justify-between items-center p-3 rounded-xl bg-gray-50">
                            <span className="font-semibold text-gray-700">
                              {floor}층 {floor === 4 ? '(3인실)' : '(1인실)'}
                            </span>
                            <span className="font-bold text-gray-900">
                              {Math.floor(Math.random() * 50) + 20}명
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function App() {
  return <DormitoryManagement />;
}

export default App;
