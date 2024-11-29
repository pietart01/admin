import { useState, useMemo } from 'react';
import { userService } from '@/services/userService';
import {UsersTable} from '@/components/UsersTable';
import {UserSearch} from '@/components/UserSearch';
import {Pagination} from '@/components/Pagination';
import {AddPointsModal} from '@/components/AddPointsModal';
import {AddBonusModal} from '@/components/AddBonusModal';
import {useUsers} from '@/hooks/useUsers';
import {HierarchicalUsersTable} from '@/components/HierarchicalUsersTable';
import { CreateUserModal } from '@/components/CreateUserModal';

export default function Users() {
  const {
    users,
    currentPage,
    totalPages,
    isLoading,
    searchTerm,
    setSearchTerm,
    setCurrentPage,
    refreshUsers
  } = useUsers();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isBonusModalOpen, setIsBonusModalOpen] = useState(false);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);

  const handleAddPoints = async (points) => {
    try {
      await userService.addPoints(selectedUserId, points);
      setIsModalOpen(false);
      refreshUsers();
    } catch (error) {
      console.error('Error adding points:', error);
    }
  };

  const handleAddBonus = async (bonus) => {
    try {
      await userService.addBonus(selectedUserId, bonus);
      setIsBonusModalOpen(false);
      refreshUsers();
    } catch (error) {
      console.error('Error adding bonus:', error);
    }
  };

  const handleCreateUser = async (user) => {
/*     try {
      await userService.createUser(user);
      setIsCreateUserModalOpen(false);
      refreshUsers();
    } catch (error) {
      console.error('Error creating user:', error);
    }
 */  }

  return (
    <div className="p-4">
      {/* <h2 className="text-2xl font-bold mb-4">Users Management</h2> */}
      <div className="bg-white shadow rounded-lg p-6">
        <UserSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {isLoading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            {users.length > 0 && (
              <HierarchicalUsersTable
                users={users}
                onAddPoints={(userId) => {
                  setSelectedUserId(userId);
                  setIsModalOpen(true);
                }}
                onAddBonus={(userId) => {
                  setSelectedUserId(userId);
                  setIsBonusModalOpen(true);
                }}
                onAddUser={(userId) => {
                  console.log('onAddUser', userId);
                  setSelectedUserId(userId);
                  setIsCreateUserModalOpen(true);
                }}
              />
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        <AddPointsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddPoints}
        />

        <AddBonusModal
          isOpen={isBonusModalOpen}
          onClose={() => setIsBonusModalOpen(false)}
          onSubmit={handleAddBonus}
        />
        <CreateUserModal
          selectedUserId={selectedUserId}
          isOpen={isCreateUserModalOpen}
          onClose={() => setIsCreateUserModalOpen(false)}
          onSubmit={handleCreateUser}
        />
      </div>
    </div>
  );
}
