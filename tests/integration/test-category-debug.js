/**
 * Deep debug test for categories
 */

import { Event } from '../../core/events/Event.js';

console.log('Deep debugging categories...\n');

// Test the normalize function directly
const testData = {
    id: 'test-1',
    title: 'Test Meeting',
    start: new Date('2025-01-15T10:00:00'),
    end: new Date('2025-01-15T11:00:00'),
    category: 'meeting'  // Singular
};

console.log('Input data:');
console.log('  category:', testData.category);
console.log('  categories:', testData.categories);

// Call normalize directly
const normalized = Event.normalize(testData);

console.log('\nNormalized data:');
console.log('  categories:', normalized.categories);
console.log('  category still present?:', 'category' in normalized);

// Create an Event with it
console.log('\nCreating Event...');
try {
    const event = new Event(testData);
    console.log('Event created successfully');
    console.log('  event.categories:', event.categories);
    console.log('  event.category (getter):', event.category);
} catch (error) {
    console.error('Error creating event:', error.message);
}