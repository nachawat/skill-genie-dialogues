# Combine Delegation and Manual Control for Dialogs

### **Objective** : You will create an intention add activate Dialog Management with required slots, prompts & utterances to collect the correct values.

1. Navigate to the `Build` Tab

2. Create a Custom Slot Type named `Drink_Type`

![save](./images/drink_type.png)

Then add the following values (don't forget the ID column!)

![save](./images/drink_type_values.png)

3. Create a Custom Slot Type named `Coffee_Roast_Type`

![save](./images/coffee_roast_type.png)

Then add the following values (don't forget the synonyms column!)

![save](./images/coffee_roast_type_values.png)

4. Create a Custom Slot Type named `Tea_Type`

![save](./images/tea_type.png)

Then add the following values

![save](./images/tea_type_values.png)

5. Save your Interaction Model

![save](./images/todo_save_model.png)

6. Add a Custom Intent to your Interaction Model named `OrderIntent`

![save](./images/add_orderintent.png)

7. Save your Interaction Model

![save](./images/todo_save_model.png)

8. Add the following utterances to the newly created intent `OrderIntent`

```
j'ai soif
                    
je veux boire un {drink} {coffeeRoast}

je veux un {drink}

un {drink} {teaType}
```

![save](./images/orderintent_utterances.png)

9. Disable Dialog Auto Delegation

To allow Alexa to sent request for each turn of a dialog, as the default Skill strategy is Auto-delegation (default), we shall disable the `Auto-Delegation` Strategy.

![save](./images/orderintent_no_autodelegation.png)

10. Assign each slot a type

```
(1) drink => Drink_Type
                    
(2) coffeeRoast => Coffee_Roast_Type

(3) teaType => Tea_Type

```

![save](./images/orderintent_slots_type.png)

>  **Important**: Be aware that you can define the order in which the slot will be collected by Alexa while using the Dialog Management feature.

11. Save your Interaction Model

![save](./images/todo_save_model.png)

12. Make `drink` Slot as required

* Click on the `drink` slot from `OrderIntent` and enable slot required

* Add prompts to allow Alexa to ask the user for this slot value

* Add utterances to allow Alexa to recognize what the user says

![save](./images/orderintent_drink_required.png)

>  **Important**: In utterances you provide you shall add the required slot you want to collect {destination}

13. Add Validation Rules for `drink` slot

Slot validation lets you create validation rules for your slot values. Alexa can then check the user's response against these rules and prompt the user if the user provides an unacceptable value.

![save](./images/drink_validation_rules.png)

We will limit the eligible `drink` values to the values listed in the `Drink_Type` SlotType using a `Accept only Slot type's values and synonyms` validation rule.

Accept values that are defined in the list of custom slot type values and synonyms. If the user provides a value that does not match any of these defined values, the value fails the validation and Alexa can use your prompts to ask the user for a new value.
In this way, it will allow us to limit the eligibel 

![save](./images/drink_validation_rules_accept_only.png)

14. Save your Interaction Model

![save](./images/todo_save_model.png)

15. Build your Interaction Model

![save](./images/todo_build_model.png)

> **Important**: You must successfully build the model before you can test it.

### Next : [Update your Skill Backend](./05-backend-orderintent.md)