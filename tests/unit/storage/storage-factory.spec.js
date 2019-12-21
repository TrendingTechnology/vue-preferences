import StorageFactory from '../../../src/storage/storage-factory';
import BaseStorage from '../../../src/storage/base-storage';
import DefaultableStorage from '../../../src/storage/defaultable-storage';
import NamespaceableStorage from '../../../src/storage/namespaceable-storage';
import SerializableStorage from '../../../src/storage/serializable-storage';

describe('StorageFactory', () => {
  let underlyingStorage;
  let storage;

  beforeEach(() => {
    underlyingStorage = { getItem: jest.fn(), setItem: jest.fn() };

    window.localStorage = underlyingStorage;
  });

  describe('.build', () => {
    describe('when no options are given', () => {
      beforeEach(() => {
        storage = StorageFactory.build();
      });

      it('sets up window.localStorage as the underlying storage', () => {
        expect(storage.underlyingStorage).toBeInstanceOf(BaseStorage);
        expect(storage.underlyingStorage.underlyingStorage).toEqual(window.localStorage);
      });

      it('sets up a SerializableStorage with the default options', () => {
        expect(storage).toBeInstanceOf(SerializableStorage);
        expect(storage.serializer).not.toEqual(undefined);
        expect(storage.deserializer).not.toEqual(undefined);
      });
    });

    describe('when a storage option is given', () => {
      beforeEach(() => {
        storage = StorageFactory.build({ storage: { ...underlyingStorage, id: 1 } });
      });

      it('sets up the provided storage as the underlying storage', () => {
        expect(storage.underlyingStorage).toBeInstanceOf(BaseStorage);
        expect(storage.underlyingStorage.underlyingStorage.id).toEqual(1);
      });
    });

    describe('when a serializer option is given', () => {
      let serializer = jest.fn();

      beforeEach(() => {
        storage = StorageFactory.build({ serializer });
      });

      it('sets up the serializer on the SerializableStorage storage', () => {
        expect(storage).toBeInstanceOf(SerializableStorage);
        expect(storage.serializer).toEqual(serializer);
      });
    });

    describe('when a deserializer option is given', () => {
      let deserializer = jest.fn();

      beforeEach(() => {
        storage = StorageFactory.build({ deserializer });
      });

      it('sets up the deserializer on the SerializableStorage storage', () => {
        expect(storage).toBeInstanceOf(SerializableStorage);
        expect(storage.deserializer).toEqual(deserializer);
      });
    });

    describe('when a namespace option is given', () => {
      beforeEach(() => {
        storage = StorageFactory.build({ namespace: 'namespace1' });
      });

      it('sets up a NamespaceableStorage', () => {
        expect(storage).toBeInstanceOf(NamespaceableStorage);
        expect(storage.namespace).toEqual('namespace1');
      });
    });

    describe('when a default option is given', () => {
      beforeEach(() => {
        storage = StorageFactory.build({ default: 'abc' });
      });

      it('sets up a NamespaceableStorage', () => {
        expect(storage).toBeInstanceOf(DefaultableStorage);
        expect(storage.defaultValue).toEqual('abc');
      });
    });
  });
});
