package com.medclic.med.exception;

public class LocationNotFoundException  extends RuntimeException{
    public LocationNotFoundException (String message){

        super(message);
    }
}
