// play.elevatorsaga.com
{
    init: function(elevators, floors) {
        var elevator = elevators[0]; // Let's use the first elevator

        // Whenever the elevator is idle (has no more queued destinations) ...
        elevator.on("idle", function() {
            // let's go to all the floors (or did we forget one?)
            /*if (elevator.currentFloor() == 0)
                for (let i = 0; i < floors.length; i++)
                    elevator.goToFloor(i);
            else
                for (let i = floors.length - 1; i >= 0; i--)
                    elevator.goToFloor(i);*/
        });

        // When a passenger presses a button to go to a floor...
        elevator.on("floor_button_pressed", function(floorNum) {
            //elevator.goToFloor(floorNum);
        });
        
        elevator.on("passing_floor", function(floorNum, direction) {
            let floor = floors[floorNum];
            //if (direction == "up" && floor.up_button_)

        });
        
        elevator.on("stopped_at_floor", function(floorNum) {
            if(elevator.getPressedFloors().length > 0) {
                //goToPressedFloors(elevator);
                goToFirstPressedFloor(elevator);
            }
            else
                elevator.goToFloor(0);
        });
        
        function goToAllPressedFloors(elevator) {
            let pressedFloors = elevator.getPressedFloors();
            for (let i = 0; i < pressedFloors.length; i++)
                elevator.goToFloor(pressedFloors[i]);
        }

        function goToFirstPressedFloor(elevator) {
            let currentFloor = elevator.currentFloor();
            let pressedFloors = elevator.getPressedFloors();
            let numFloors = floors.length;

            elevator.goToFloor(pressedFloors[0]);
        }

        function getMiddleFloorNumber() {
            let numFloors = floors.length;
            let floor = floors[numFloors/2];
            return floor.floorNum;
        }
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}
