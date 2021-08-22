{
    init: function(elevators, floors) {
        // set up floor button tracking
        var upFloors = [];
        var downFloors = [];

        for (let i = 0; i < floors.length; i++) {
            floors[i].on("up_button_pressed", function() {
                if (!upFloors.includes(floors[i].floorNum()))
                    upFloors.push(floors[i].floorNum());
            });
            floors[i].on("down_button_pressed", function() {
                if (!downFloors.includes(floors[i].floorNum()))
                    downFloors.push(floors[i].floorNum());
            });
        }

        // set up elevators
        for (let i = 0; i < elevators.length; i++) {
            let elevator = elevators[i];

            // Whenever the elevator is idle (has no more queued destinations) ...
            elevator.on("idle", function() {
                let midFloor = getMiddleFloorNumber();
                if (elevator.currentFloor() >= midFloor)
                    elevator.goToFloor(floors[0].floorNum());
                else
                    elevator.goToFloor(floors[floors.length-1].floorNum());
            });

            // When a passenger presses a button to go to a floor...
            elevator.on("floor_button_pressed", function(floorNum) {
                //elevator.goToFloor(floorNum);
            });

            elevator.on("passing_floor", function(floorNum, direction) {
                if (direction === "up" && upFloors.includes(floorNum)) {
                    let pos = upFloors.indexOf(floorNum);
                    let removedFloor = upFloors.splice(pos, 1);
                    elevator.goToFloor(floorNum, true);
                } else if (direction === "down" && downFloors.includes(floorNum)) {
                    let pos = downFloors.indexOf(floorNum);
                    let removedFloor = downFloors.splice(pos, 1);
                    elevator.goToFloor(floorNum, true);
                }
            });

            elevator.on("stopped_at_floor", function(floorNum) {
                if(elevator.getPressedFloors().length > 0) {
                    goToFirstPressedFloor(elevator);
                }
                else
                    elevator.goToFloor(0);
            });
        } 

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
            return floor.floorNum();
        }
    },
        update: function(dt, elevators, floors) {

        }
}
