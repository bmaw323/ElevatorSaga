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

        // set up elevator use tracking
        var elevatorUsed = [];

        // set up elevators
        for (let i = 0; i < elevators.length; i++) {
            let elevator = elevators[i];
            elevatorUsed.push(false);

            // Whenever the elevator is idle (has no more queued destinations) ...
            elevator.on("idle", function() {
                elevator.goingUpIndicator(true);
                elevator.goingDownIndicator(true);
                /*if (upFloors.includes(floors[0].floorNum())) {
                    elevator.goToFloor(floors[0].floorNum());
                    return;
                } else if (downFloors.includes(floors[floors.length-1].floorNum())) {
                    elevator.goToFloor(floors[floors.length-1].floorNum());
                    return;
                }*/
                    
                if (elevatorUsed[i] === false)
                    return;

                let midFloor = getMiddleFloorNumber();
                if (elevator.currentFloor() >= midFloor)
                    elevator.goToFloor(floors[0].floorNum());
                else
                    elevator.goToFloor(floors[floors.length-1].floorNum());
            });

            // When a passenger presses a button to go to a floor...
            elevator.on("floor_button_pressed", function(floorNum) {
                elevatorUsed[i] = true;
                if (!elevator.destinationQueue.includes(floorNum)){
                    addFloorToQueue(elevator, floorNum);
                }
            });

            elevator.on("passing_floor", function(floorNum, direction) {
                if (elevator.getPressedFloors().includes(floorNum)){
                    removeFloorFromQueue(elevator, floorNum);
                    elevator.goToFloor(floorNum, true);
                }

                // don't stop if we probably can't pick anyone up...
                if (elevator.loadFactor() > 0.6)
                    return;

                if (direction === "up" || elevator.destinationDirection() === "up") {
                    elevator.goingUpIndicator(true);
                    elevator.goingDownIndicator(false);
                } else if (direction === "down" || elevator.destinationDirection() === "down") {
                    elevator.goingUpIndicator(false);
                    elevator.goingDownIndicator(true);
                }

                if (direction === "up" && upFloors.includes(floorNum)) {
                    let pos = upFloors.indexOf(floorNum);
                    let removedFloor = upFloors.splice(pos, 1);
                    elevator.goToFloor(floorNum, true);
                    console.log(`upward passing stop ${elevator.loadFactor()}`);
                } else if (direction === "down" && downFloors.includes(floorNum)) {
                    let pos = downFloors.indexOf(floorNum);
                    let removedFloor = downFloors.splice(pos, 1);
                    elevator.goToFloor(floorNum, true);
                    console.log(`downward passing stop ${elevator.loadFactor()}`);
                }
            });

            elevator.on("stopped_at_floor", function(floorNum) {

                if (floorNum === 0) {
                    elevator.goingUpIndicator(true);
                    elevator.goingDownIndicator(false);
                } else if (floorNum === floors[floors.length - 1].floorNum()) {
                    elevator.goingUpIndicator(false);
                    elevator.goingDownIndicator(true);
                } /*else if (elevator.destinationQueue.length === 0) {
                    elevator.goingUpIndicator(true);
                    elevator.goingDownIndicator(true);
                } else if (elevator.destinationDirection() === "up"){
                    elevator.goingUpIndicator(true);
                    elevator.goingDownIndicator(false);
                } else if (elevator.destinationDirection() === "down"){
                    elevator.goingUpIndicator(false);
                    elevator.goingDownIndicator(true);
                } else {
                    elevator.goingUpIndicator(true);
                    elevator.goingDownIndicator(true);
                }*/
                
                if (elevator.loadFactor() < 0.1) {
                    clearQueue(elevator);
                }
            });
        } 

        function goToAllPressedFloors(elevator) {
            let pressedFloors = elevator.getPressedFloors();
            for (let i = 0; i < pressedFloors.length; i++)
                elevator.goToFloor(pressedFloors[i]);
        }

        function goToFirstPressedFloor(elevator) {
            elevator.goToFloor(pressedFloors[0]);
        }

        function goToClosestPressedFloor(elevator) {
            let currentFloor = elevator.currentFloor();
            let pressedFloors = elevator.getPressedFloors();
            let numFloors = floors.length;
        }

        function getMiddleFloorNumber() {
            let numFloors = floors.length;
            let floor = floors[numFloors/2];
            return floor.floorNum();
        }

        function addFloorToQueue(elevator, floorNum) {
            elevator.destinationQueue.push(floorNum);
            elevator.checkDestinationQueue();
        }

        function removeFloorFromQueue(elevator, floorNum) {
            let pos = elevator.destinationQueue.indexOf(floorNum);
            elevator.destinationQueue.splice(pos, 1);
            elevator.checkDestinationQueue();
        }

        function clearQueue(elevator) {
            elevator.destinationQueue = [];
            elevator.checkDestinationQueue();
        }
    },
    update: function(dt, elevators, floors) {
    }
}
