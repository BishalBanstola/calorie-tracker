class CalorieTrackerModel {
    constructor() {
      this.caloriesToday = 0;
      this.targetGoal = null;
      this.dailyCaloriesHistory = {};
      this.foodList = [];
    }
  
    updateCaloriesToday(amount) {
      const today = new Date().toLocaleDateString();
      if (!this.dailyCaloriesHistory[today]) {
        this.dailyCaloriesHistory[today] = 0;
      }
      this.caloriesToday += amount;
      this.dailyCaloriesHistory[today] += amount;
    }
  
    addFood(foodName, calories) {
      this.foodList.push({ foodName, calories });
    }
  
    getTotalConsumedCalories() {
      return this.caloriesToday;
    }
  
    setTargetGoal(goal) {
      this.targetGoal = goal;
    }
  
    getTargetGoal() {
      return this.targetGoal;
    }
  
    getDailyCaloriesHistory() {
      return this.dailyCaloriesHistory;
    }
  
    getFoodList() {
      return this.foodList;
    }
  }
  
  class CalorieTrackerView {
    constructor() {
      this.totalCaloriesElement = document.getElementById('totalCalories');
      this.calorieGoalInput = document.getElementById('calorieGoalInput');
      this.addButton = document.getElementById('addButton');
      this.submitGoalButton = document.getElementById('submitGoalButton');
      this.foodNameInput = document.getElementById('foodNameInput');
      this.foodCaloriesInput = document.getElementById('foodCaloriesInput');
      this.historyList = document.getElementById('historyList');
      this.foodListContainer = document.getElementById('foodList');
    }
  
    displayTotalCalories(totalCalories, targetGoal) {
      this.totalCaloriesElement.textContent = `Total Calories: ${totalCalories} / ${targetGoal}`;
    }
  
    getFoodInput() {
      const foodName = this.foodNameInput.value.trim();
      const calories = parseInt(this.foodCaloriesInput.value.trim());
      return { foodName, calories };
    }
  
    clearFoodInput() {
      this.foodNameInput.value = '';
      this.foodCaloriesInput.value = '';
    }
  
    bindAddFood(handler) {
      this.addButton.addEventListener('click', handler);
    }
  
    bindSubmitGoal(handler) {
      this.submitGoalButton.addEventListener('click', handler);
    }
  
    displayHistory(history) {
      this.historyList.innerHTML = '';
      history.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = entry;
        this.historyList.appendChild(li);
      });
    }
  
    getCalorieGoalInput() {
      return parseInt(this.calorieGoalInput.value.trim());
    }
  
    displayFoodList(foodList) {
      this.foodListContainer.innerHTML = '';
      const ul = document.createElement('ul');
      foodList.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.foodName}: ${item.calories} calories`;
        ul.appendChild(li);
      });
      this.foodListContainer.appendChild(ul);
    }
  
    disableAddFoodButton() {
      this.addButton.disabled = true;
    }
  
    enableAddFoodButton() {
      this.addButton.disabled = false;
    }
  }
  
  class CalorieTrackerController {
    constructor(model, view) {
      this.model = model;
      this.view = view;
  
      this.view.bindAddFood(this.handleAddFood.bind(this));
      this.view.bindSubmitGoal(this.handleSetGoal.bind(this));
  
      if (!this.model.getTargetGoal()) {
        this.view.disableAddFoodButton();
      }
  
      this.updateView();
    }
  
    handleAddFood() {
      const { foodName, calories } = this.view.getFoodInput();
      if (!foodName || isNaN(calories)) {
        alert('Please enter valid food name and calories.');
        return;
      }
      if (!this.model.getTargetGoal()) {
        alert('Please set a calorie goal before adding food.');
        return;
      }
      this.model.addFood(foodName, calories);
      this.model.updateCaloriesToday(calories);
      this.updateView();
    }
  
    handleSetGoal() {
      const newGoal = this.view.getCalorieGoalInput();
      this.model.setTargetGoal(newGoal);
      this.view.enableAddFoodButton();
      this.updateView();
    }
  
    updateView() {
      const totalCalories = this.model.getTotalConsumedCalories();
      const targetGoal = this.model.getTargetGoal();
      const dailyHistory = this.model.getDailyCaloriesHistory();
      const foodList = this.model.getFoodList();
      this.view.displayTotalCalories(totalCalories, targetGoal);
      this.view.displayHistory(Object.entries(dailyHistory).map(([date, calories]) => `${date}: ${calories} calories`));
      this.view.displayFoodList(foodList);
    }
  }
  
  const model = new CalorieTrackerModel();
  const view = new CalorieTrackerView();
  const controller = new CalorieTrackerController(model, view);
  