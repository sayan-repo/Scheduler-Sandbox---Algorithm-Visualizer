export class PriorityQueue {
    constructor() {
      this.heap = [];
    }
  
    getParentIndex(i) { return Math.floor((i - 1) / 2); }
    getLeftChildIndex(i) { return 2 * i + 1; }
    getRightChildIndex(i) { return 2 * i + 2; }
  
    swap(i, j) {
      [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }
  
    compare(a, b) {
      return a.priority < b.priority;
    }
  
    // O(log n)
    insert(job) {
      this.heap.push(job);
      this.siftUp(this.heap.length - 1);
    }
  
    siftUp(i) {
      let parentIndex = this.getParentIndex(i);
      while (i > 0 && this.compare(this.heap[i], this.heap[parentIndex])) {
        this.swap(i, parentIndex);
        i = parentIndex;
        parentIndex = this.getParentIndex(i);
      }
    }
    
    // O(log n)
    extractMin() {
      if (this.isEmpty()) return null;
      this.swap(0, this.heap.length - 1);
      const min = this.heap.pop();
      this.siftDown(0);
      return min;
    }
  
    siftDown(i) {
      let minIndex = i;
      const leftIndex = this.getLeftChildIndex(i);
      const rightIndex = this.getRightChildIndex(i);
      const size = this.heap.length;
  
      if (leftIndex < size && this.compare(this.heap[leftIndex], this.heap[minIndex])) {
        minIndex = leftIndex;
      }
  
      if (rightIndex < size && this.compare(this.heap[rightIndex], this.heap[minIndex])) {
        minIndex = rightIndex;
      }
  
      if (i !== minIndex) {
        this.swap(i, minIndex);
        this.siftDown(minIndex);
      }
    }
  
    peek() {
      return this.isEmpty() ? null : this.heap[0];
    }
  
    isEmpty() {
      return this.heap.length === 0;
    }
  
    size() {
      return this.heap.length;
    }
  }