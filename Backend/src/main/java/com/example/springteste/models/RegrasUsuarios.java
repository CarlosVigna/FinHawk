package com.example.springteste.models;

public enum RegrasUsuarios {
    ADMIN("admin"),
    USUARIO("usuario");

    private String regra;

    RegrasUsuarios(String regra){
        this.regra = regra;
    }

    public String getRegra(){
        return  regra;
    }

}
