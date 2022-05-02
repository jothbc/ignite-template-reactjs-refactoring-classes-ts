import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food, { FoodProps } from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

const Dashboard = () => {
  const [foods, setFoods] = useState([] as FoodProps[]);
  const [editingFood, setEditingFood] = useState({} as FoodProps);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditiModalOpen] = useState(false);

  useEffect(() => {
    const execute = async () => {
      const response = await api.get('/foods');
      setFoods(response.data);
    }
    execute();
  }, []);

  const handleAddFood = async (food: FoodProps) => {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });
      setFoods(prev => [...prev, response.data]);

    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async (food: FoodProps) => {

    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = async (id: string) => {

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);
    setFoods(foodsFiltered);
  }

  const toggleModal = () => {
    setModalOpen(prev => !prev);
  }

  const toggleEditModal = () => {
    setEditiModalOpen(prev => !prev);
  }

  const handleEditFood = (food: FoodProps) => {
    setEditingFood(food);
    setEditiModalOpen(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
